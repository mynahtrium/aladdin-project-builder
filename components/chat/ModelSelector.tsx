"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "@/store/useSettingsStore";

type Props = {
  disabled?: boolean;
};

const fetchModels = async (apiKey: string | null) => {
  const response = await fetch("/api/models", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: apiKey || undefined }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as any;
    throw new Error(body?.error || "Failed to load models");
  }

  const body = (await response.json().catch(() => null)) as any;
  return Array.isArray(body?.models) ? (body.models as string[]) : [];
};

export const ModelSelector: React.FC<Props> = ({ disabled }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  
  const { selectedModel, setModel, apiKey } = useSettingsStore();

  const { data: models, isLoading, error } = useQuery({
    queryKey: ["models", apiKey],
    queryFn: () => fetchModels(apiKey),
    enabled: open, // Only fetch when opened
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  const visibleModels = useMemo(() => {
    const list = models ?? [];
    const unique = Array.from(new Set([selectedModel, ...list].filter(Boolean)));
    return unique;
  }, [models, selectedModel]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="h-9 max-w-[220px] inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5"
      >
        <span className="truncate">{selectedModel}</span>
        <ChevronDown size={16} className="shrink-0 opacity-80" />
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 z-50 w-[260px] overflow-hidden rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl">
          <div className="max-h-[280px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {isLoading && (
              <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Loading models…
              </div>
            )}

            {!isLoading && error && (
              <div className="px-3 py-2 text-sm text-destructive">{(error as Error).message}</div>
            )}

            {!isLoading &&
              !error &&
              visibleModels.map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => {
                    setModel(model);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 ${
                    model === selectedModel ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="block truncate">{model}</span>
                </button>
              ))}

            {!isLoading && !error && visibleModels.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No models found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
