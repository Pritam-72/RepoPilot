import React from "react";

export interface DiffViewerProps {
  patch: string;
  highlightLine?: number;
}

export function DiffViewer({ patch, highlightLine }: DiffViewerProps) {
  const lines = patch.split("\n");

  return (
    <div
      data-testid="diff-viewer"
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "0.8125rem",
        background: "#0d1117",
        color: "#c9d1d9",
        borderRadius: "0.375rem",
        overflowX: "auto",
        border: "1px solid #30363d",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {lines.map((line, idx) => {
            const isAdded = line.startsWith("+") && !line.startsWith("+++");
            const isRemoved = line.startsWith("-") && !line.startsWith("---");
            const isHunkHeader = line.startsWith("@@");
            const lineNumber = idx + 1;
            const isHighlighted = highlightLine !== undefined && highlightLine === lineNumber;

            let bg = "transparent";
            let textColor = "#c9d1d9";
            if (isAdded) {
              bg = "rgba(46, 160, 67, 0.15)";
              textColor = "#7ee787";
            } else if (isRemoved) {
              bg = "rgba(248, 81, 73, 0.15)";
              textColor = "#ffa198";
            } else if (isHunkHeader) {
              bg = "rgba(56, 139, 253, 0.15)";
              textColor = "#79c0ff";
            }

            if (isHighlighted) {
              bg = "rgba(234, 179, 8, 0.25)";
            }

            return (
              <tr
                key={idx}
                style={{
                  backgroundColor: bg,
                  borderLeft: isHighlighted ? "3px solid #eab308" : "none",
                }}
              >
                <td
                  style={{
                    padding: "0.125rem 0.5rem",
                    color: "#6e7681",
                    textAlign: "right",
                    userSelect: "none",
                    width: "3rem",
                    borderRight: "1px solid #21262d",
                  }}
                >
                  {lineNumber}
                </td>
                <td
                  style={{
                    padding: "0.125rem 0.75rem",
                    color: textColor,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {line}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

