"use client"

import { useEffect } from "react"

import { supabase } from "@/lib/supabase/client"

export function useRealtimeOperacional() {
  useEffect(() => {
    const channel = supabase.channel(
      "operacao-tempo-real"
    )

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "convocacoes",
        },
        (payload) => {
          console.log(
            "Realtime convocações:",
            payload
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}