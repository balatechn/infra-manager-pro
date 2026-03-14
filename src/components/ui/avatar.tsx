import * as React from "react";
import { cn, getInitials, getAvatarColor } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
}

function Avatar({ name, size = "md", className, ...props }: AvatarProps) {
  const sizes = {
    xs: "w-5 h-5 text-[8px]",
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white",
        getAvatarColor(name),
        sizes[size],
        className
      )}
      title={name}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
}

function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const extra = names.length - max;

  return (
    <div className="flex -space-x-2">
      {shown.map((name) => (
        <Avatar key={name} name={name} size="sm" className="ring-2 ring-slate-800" />
      ))}
      {extra > 0 && (
        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-600 text-[10px] font-medium text-slate-300 ring-2 ring-slate-800">
          +{extra}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarStack };
