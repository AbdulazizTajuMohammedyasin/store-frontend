import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { User } from "../types/auth";
import { getCurrentUser } from "../api/auth";
import { SESSION_EXPIRED_EVENT } from "../lib/session";

interface AuthContextType {
  user: User | null;

  setUser: (user: User | null) => void;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // The tokens could not be refreshed: log out in the UI too, so the page
  // stops looking logged in while every request goes out without a token.
  useEffect(() => {
    const onSessionExpired = async () => {
      if (!userRef.current) return; // visitors who were never logged in
      userRef.current = null; // several requests can fail at once; react only once

      setUser(null);
      queryClient.clear();
      toast.error("Your session has expired. Please log in again.");

      // Imported lazily: the router imports pages that import this context.
      const { router } = await import("../router");
      const isAdmin = window.location.pathname.startsWith("/admin");
      router.navigate(isAdmin ? "/admin/login" : "/login");
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () =>
      window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  }, [queryClient]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
