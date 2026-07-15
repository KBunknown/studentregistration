import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PremiumBackground({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("premium-scene relative min-h-screen", className)}>
      <div className="premium-bg" aria-hidden="true">
        <div className="premium-bg__mesh" />
        <div className="premium-bg__wave premium-bg__wave--1" />
        <div className="premium-bg__wave premium-bg__wave--2" />
        <div className="premium-bg__wave premium-bg__wave--3" />
        <div className="premium-bg__curve premium-bg__curve--1" />
        <div className="premium-bg__curve premium-bg__curve--2" />
        <div className="premium-bg__glow premium-bg__glow--1" />
        <div className="premium-bg__glow premium-bg__glow--2" />
      </div>
      {children}
    </div>
  );
}
