import { useEffect, useState } from "react";
import { getStudentPhoto } from "@/lib/api";

interface Props {
  filename?: string | null;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function StudentPhoto({ filename, alt = "", className, fallback }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!filename) {
      setSrc(null);
      return;
    }
    setLoading(true);
    getStudentPhoto(filename)
      .then((d) => {
        if (mounted) setSrc(d);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [filename]);

  if (!src) {
    return <>{fallback ?? null}</>;
  }
  return <img src={src} alt={alt} className={className} />;
}
