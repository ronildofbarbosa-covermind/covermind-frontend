"use client"

import { useEffect } from "react"

interface UseAutoRefreshOperacionalProps {
  callback: () => void | Promise<void>
  intervalo?: number
}

export function useAutoRefreshOperacional({
  callback,
  intervalo = 10000,
}: UseAutoRefreshOperacionalProps) {
  useEffect(() => {
    callback()

    const timer = setInterval(() => {
      callback()
    }, intervalo)

    return () => clearInterval(timer)
  }, [callback, intervalo])
}