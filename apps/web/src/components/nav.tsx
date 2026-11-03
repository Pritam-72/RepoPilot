import React from "react";

export interface NavProps {
  activePath?: string;
}

export function Nav({ activePath = "/" }: NavProps) {
  const links = [
    { label: "Overview", href: "/" },
    { label: "Repositories", href: "/repositories" },
    { label: "Reviews", href: "/reviews" },
  ];

  return (
    <header style={{ borderBottom: "1px solid #e5e7eb", background: "#ffffff", padding: "0 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "#111827", fontWeight: 700, fontSize: "1.25rem" }}>
            <span style={{ display: "inline-block", width: "1.75rem", height: "1.75rem", borderRadius: "0.375rem", background: "#2563eb", color: "#ffffff", textAlign: "center", lineHeight: "1.75rem", fontSize: "0.875rem", fontWeight: 800 }}>
              RP
            </span>
            <span>RepoPilot</span>
          </a>
          <nav style={{ display: "flex", gap: "1rem" }}>
            {links.map((link) => {
              const isActive = activePath === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    textDecoration: "none",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: isActive ? "#2563eb" : "#4b5563",
                    background: isActive ? "#eff6ff" : "transparent",
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#16a34a", background: "#f0fdf4", padding: "0.25rem 0.625rem", borderRadius: "9999px", fontWeight: 500, border: "1px solid #bbf7d0" }}>
            <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#16a34a" }} />
            System Operational
          </span>
        </div>
      </div>
    </header>
  );
}
