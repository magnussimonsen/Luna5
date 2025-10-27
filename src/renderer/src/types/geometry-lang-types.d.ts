/**
 * Type definitions for the Geometry Language
 * Basic placeholders for the geometry cell functionality
 */

export interface GeometryPoint {
  id: string
  x: number
  y: number
  label?: string
}

export interface GeometryLine {
  id: string
  point1: string // ID of first point
  point2: string // ID of second point
  label?: string
}

export interface GeometryCircle {
  id: string
  center: string // ID of center point
  radius: number
  label?: string
}

export interface GeometryObject {
  type: 'point' | 'line' | 'circle'
  id: string
  properties: Record<string, unknown>
}

export interface GeometryCommand {
  type: string
  args: unknown[]
  result?: string // ID of created object
}

export interface GeometryState {
  objects: Record<string, GeometryObject>
  commands: GeometryCommand[]
  canvas?: {
    width: number
    height: number
    scale: number
  }
}
