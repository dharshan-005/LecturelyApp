"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function EditableTitle({
  lectureId,
  initialTitle,
}: {
  lectureId: string;
  initialTitle: string;
}) {
  const { data: session } = useSession();

  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lectures/${lectureId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.email}`,
          },
          body: JSON.stringify({ title }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update title");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {isEditing ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "16px",
              width: "300px",
            }}
          />

          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2>{title}</h2>

          <button onClick={() => setIsEditing(true)}>✏️</button>
        </div>
      )}
    </div>
  );
}
