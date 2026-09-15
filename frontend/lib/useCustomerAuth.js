"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useCustomerAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .me()
      .then((result) => {
        if (active)
          setUser(result.user?.role === "customer" ? result.user : null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { user, loading };
}

export function signInPath(nextPath) {
  return `/signin?next=${encodeURIComponent(nextPath)}`;
}
