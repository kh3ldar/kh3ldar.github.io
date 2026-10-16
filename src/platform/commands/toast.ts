/** A bridge so non-React code (commands) can raise Fluent toasts rendered by the app shell. */
export type ToastIntent = 'success' | 'info' | 'warning' | 'error'

export interface ToastMessage {
  title: string
  body?: string
  intent?: ToastIntent
}

type Dispatcher = (message: ToastMessage) => void

let dispatcher: Dispatcher | null = null

export function registerToastDispatcher(fn: Dispatcher): () => void {
  dispatcher = fn
  return () => {
    if (dispatcher === fn) dispatcher = null
  }
}

export function showToast(message: ToastMessage) {
  dispatcher?.(message)
}
