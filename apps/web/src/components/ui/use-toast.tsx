import { createContext, useContext, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

export interface Toast {
  id: number
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }: Omit<Toast, "id">) => {
      const id = toastId++
      const newToast = { id, title, description, variant, duration }
      setToasts((currentToasts) => [...currentToasts, newToast])

      setTimeout(() => {
        setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
      }, duration)
    },
    []
  )

  const dismiss = useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative pointer-events-auto"
            >
              <div
                className={`flex gap-3 rounded-lg p-4 shadow-lg ${
                  t.variant === "destructive"
                    ? "bg-red-600 text-white"
                    : t.variant === "success"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{t.title}</h3>
                  {t.description && (
                    <p className="text-sm opacity-90 mt-1">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
