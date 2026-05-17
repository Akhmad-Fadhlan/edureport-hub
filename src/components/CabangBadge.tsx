import { CABANG_COLOR, CABANG_LABEL, isCabang } from "@/lib/cabang";
import { cn } from "@/lib/utils";

export function CabangBadge({ cabang, className }: { cabang?: string | null; className?: string }) {
  if (!cabang || !isCabang(cabang)) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        CABANG_COLOR[cabang],
        className,
      )}
    >
      {CABANG_LABEL[cabang]}
    </span>
  );
}
