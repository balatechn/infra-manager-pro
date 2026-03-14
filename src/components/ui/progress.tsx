import * as React from "react";
import { cn } from "@/lib/utils";

function Progress({ value = 0, className }: { value?: number; className?: string }) {
  const color =
    value >= 75 ? "bg-green-500" : value >= 50 ? "bg-blue-500" : value >= 25 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 rounded-full bg-slate-700">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{value}%</span>
    </div>
  );
}

export { Progress };
