import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/stores/auth-store";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const { initialized, init, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!initialized) init();
  }, [initialized, init]);
  useEffect(() => {
    if (initialized) navigate({ to: user ? "/dashboard" : "/login" });
  }, [initialized, user, navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Memuat...
    </div>
  );
}
