import { useMemo } from "react";

export function useBasePath() {
  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("adminToken");

  const basePath = useMemo(() => {
    return isAdmin ? "/admin/app" : "/app";
  }, [isAdmin]);

  return basePath;
}
