"use client";

import { useState } from "react";

export default function CreatePastePage() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body: any = { content };
    if (ttlSeconds) body.ttl_seconds = Number(ttlSeconds);
    if (maxViews) body.max_views = Number(maxViews);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to create paste");
      return;
    }

    const j = await res.json();
    window.location.href = j.url;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>Create Paste</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        <textarea
          required
          placeholder="Paste content…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ width: "100%", padding: 10 }}
        />

        <input
          type="number"
          min={1}
          placeholder="TTL (seconds) — optional"
          value={ttlSeconds}
          onChange={(e) => setTtlSeconds(e.target.value)}
          style={{ padding: 8 }}
        />

        <input
          type="number"
          min={1}
          placeholder="Max views — optional"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          style={{ padding: 8 }}
        />

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading || !content.trim()}
          style={{ padding: 10, cursor: "pointer" }}
        >
          {loading ? "Creating…" : "Create Paste"}
        </button>
      </form>
    </div>
  );
}
