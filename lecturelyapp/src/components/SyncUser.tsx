"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SyncUser() {
  const { data: session, status } = useSession();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || synced) return;

    fetch("http://localhost:5000/api/users/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user.email,
        userName: session.user.name,
        image: session.user.image,
      }),
    });

    setSynced(true);
  }, [status, session, synced]);

  return null;
}
