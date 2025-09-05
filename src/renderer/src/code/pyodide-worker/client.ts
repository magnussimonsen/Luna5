/*
  Client-side singleton wrapper for the Pyodide web worker.
  Provides a simple execute() Promise API keyed by cellId.
*/

import type { WorkerRequest, WorkerResponse } from './messageTypes'

type PendingMap = Map<
  string,
  {
    resolve: (res: Extract<WorkerResponse, { type: 'result' }>) => void
    reject: (err: Error) => void
  }
>

interface PoolEntry {
  worker: Worker
  pending: PendingMap
}

// Per-notebook worker pool
const pool = new Map<string, PoolEntry>()

function createWorker(entry: PoolEntry): void {
  const wk = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
  entry.worker = wk
  wk.onmessage = (ev: MessageEvent<WorkerResponse>) => {
    const msg = ev.data
    if (!msg) return
    if (msg.type === 'result') {
      const p = entry.pending.get(msg.cellId)
      if (p) {
        entry.pending.delete(msg.cellId)
        p.resolve(msg)
      }
    } else if (msg.type === 'error') {
      const p = entry.pending.get(msg.cellId)
      if (p) {
        entry.pending.delete(msg.cellId)
        const err = new Error(msg.message) as Error & { category?: string }
        err.category = msg.category
        p.reject(err)
      }
    }
  }
  wk.onerror = (e) => {
    const err = new Error(e.message || 'Pyodide worker error')
    for (const p of entry.pending.values()) {
      try {
        p.reject(err)
      } catch {
        /* ignore */
      }
    }
    entry.pending.clear()
  }
}

function getPoolEntry(notebookId: string): PoolEntry {
  let entry = pool.get(notebookId)
  if (!entry) {
    entry = { worker: null as unknown as Worker, pending: new Map() }
    createWorker(entry)
    pool.set(notebookId, entry)
  }
  return entry
}

export function resetWorkerForNotebook(notebookId: string): void {
  const entry = pool.get(notebookId)
  if (!entry) return
  try {
    entry.worker.terminate()
  } catch {
    /* ignore */
  }
  // Reject any in-flight requests
  for (const [key, p] of entry.pending.entries()) {
    try {
      p.reject(new Error('Worker was reset'))
    } catch {
      /* ignore */
    }
  }
  pool.delete(notebookId)
}

// Back-compat: global reset (terminates all workers)
export function resetWorker(): void {
  for (const id of pool.keys()) {
    resetWorkerForNotebook(id)
  }
}

export async function executePythonInNotebook(
  notebookId: string,
  req: Extract<WorkerRequest, { type: 'execute' }>
): Promise<Extract<WorkerResponse, { type: 'result' }>> {
  const entry = getPoolEntry(notebookId)
  const wk = entry.worker
  // Derive absolute base for public assets (works in dev and build)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BASE = ((import.meta as any)?.env?.BASE_URL as string) || '/'
  const origin = window.location.origin
  const baseUrl = `${origin}${BASE}`
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const enriched: WorkerRequest = { ...req, assetsBaseUrl: req.assetsBaseUrl || normalizedBase }
  // Replace any existing in-flight request for the same cell id (last-wins)
  if (entry.pending.has(req.cellId)) {
    const prev = entry.pending.get(req.cellId)!
    try {
      prev.reject(new Error('Replaced by a newer execution request'))
    } catch {
      /* ignore */
    }
    entry.pending.delete(req.cellId)
  }
  return new Promise((resolve, reject) => {
    entry.pending.set(req.cellId, { resolve, reject })
    wk.postMessage(enriched)
  })
}

// Back-compat wrapper: uses a shared key 'global'
export function executePythonInWorker(
  req: Extract<WorkerRequest, { type: 'execute' }>
): Promise<Extract<WorkerResponse, { type: 'result' }>> {
  return executePythonInNotebook('global', req)
}
