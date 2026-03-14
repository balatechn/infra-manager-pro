"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 40, fontFamily: "monospace", color: "#fff", background: "#0f172a", minHeight: "100vh" }}>
      <h2 style={{ color: "#f59e0b" }}>Something went wrong</h2>
      <pre style={{ color: "#f87171", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {error.message}
      </pre>
      <pre style={{ color: "#94a3b8", fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {error.stack}
      </pre>
      <button
        onClick={reset}
        style={{ marginTop: 20, padding: "8px 16px", background: "#f59e0b", color: "#000", border: "none", borderRadius: 8, cursor: "pointer" }}
      >
        Try again
      </button>
    </div>
  );
}
