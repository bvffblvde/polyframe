import type { ComponentProps } from "react";
import type { Mode, SkinId } from "@/core/document/types";
import { cn } from "@/lib/utils";

interface ArtboardRootProps extends ComponentProps<"div"> {
  mode: Mode;
  skin: SkinId;
  sketch?: boolean;
}

export function ArtboardRoot({ mode, skin, sketch, className, ...rest }: ArtboardRootProps) {
  return (
    <div
      className={cn("pf-root", className)}
      data-mode={mode}
      data-skin={skin}
      data-sketch={sketch ? "true" : undefined}
      {...rest}
    />
  );
}
