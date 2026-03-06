"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminBar() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white rounded-t-xl shadow-xl px-6 py-3 flex items-center gap-4 text-sm">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        Mode édition activé
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-white/10 hover:bg-white/20 rounded-full px-4 py-1 transition-colors text-xs flex items-center gap-1"
      >
        Déconnexion
      </button>
    </div>
  );
}
