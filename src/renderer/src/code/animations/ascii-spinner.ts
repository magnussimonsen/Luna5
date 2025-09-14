// Luna4-style ASCII spinner (| / - \) shown while running
// Python cells. Simple and lightweight, works in both light and dark modes.

import { ref } from 'vue'

const spinnerChars = ['|', '/', '-', '\\']

// Exported reactive value so components can bind to it directly.
export const spinnerChar = ref<string>(spinnerChars[0])

let spinnerInterval: number | null = null

export function startSpinner(): void {
  if (spinnerInterval) return
  let index = 0
  spinnerInterval = window.setInterval(() => {
    index = (index + 1) % spinnerChars.length
    spinnerChar.value = spinnerChars[index]
  }, 150)
}

export function stopSpinner(): void {
  if (spinnerInterval) {
    window.clearInterval(spinnerInterval as number)
    spinnerInterval = null
  }
}
