import React from "react";
import { Nav } from "../components/nav";

export const metadata = {
  title: "RepoPilot - Multi-Agent GitHub Code Review Platform",
  description: "Deterministic AST + Multi-agent verification review platform with zero-bloat precision",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RepoPilot | Agentic Code Reviewer</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          backgroundColor: "#f9fafb",
          color: "#111827",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Nav />
        <main style={{ flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "2rem 1.5rem" }}>
          {children}
        </main>
        <footer style={{ borderTop: "1px solid #e5e7eb", background: "#ffffff", padding: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
          <span>RepoPilot MVP • Powered by Multi-Agent AST & LLM Verification</span>
        </footer>
      </body>
    </html>
  );
}

