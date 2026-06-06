"use client"

import { useEffect } from "react"

import { supabase } from "@/lib/supabase/client"

export function useRealtimeOperacional() {
  useEffect(() => {
    const channel = supabase
      .channel("operacao-tempo-real")

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "eventos_operacionais",
        },
        (payload) => {
          console.log("Evento operacional realtime:", payload)

          window.location.reload()
        }
      )

      .subscribe((status) => {
        console.log("Status realtime:", status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}