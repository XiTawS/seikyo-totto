"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface CMSContextType {
  content: Record<string, string>;
  isAdmin: boolean;
  loaded: boolean;
  updateContent: (key: string, value: string, contentType?: "text" | "image") => Promise<void>;
  deleteContent: (key: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType>({
  content: {},
  isAdmin: false,
  loaded: false,
  updateContent: async () => {},
  deleteContent: async () => {},
});

export const useCMS = () => useContext(CMSContext);

export default function CMSProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [content, setContent] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const isAdmin = !!session?.user;

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const updateContent = useCallback(
    async (key: string, value: string, contentType: "text" | "image" = "text") => {
      setContent((prev) => ({ ...prev, [key]: value }));
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, contentType, page: key.split(".")[0] }),
      });
    },
    []
  );

  const deleteContent = useCallback(async (key: string) => {
    setContent((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    await fetch("/api/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
  }, []);

  return (
    <CMSContext.Provider value={{ content, isAdmin, loaded, updateContent, deleteContent }}>
      {children}
    </CMSContext.Provider>
  );
}
