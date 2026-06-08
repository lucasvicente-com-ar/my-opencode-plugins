import { type Plugin, tool } from "@opencode-ai/plugin"
import { readFileSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"

export const SessionViewerPlugin: Plugin = async ({ $, directory }) => {
  const files: string[] = []
  let counter = 0

  return {
    "tool.execute.after": async (input) => {
      if (input.tool === "write" || input.tool === "edit") {
        const fp = input.args.filePath
        if (!files.includes(fp)) files.push(fp)
      }
    },
    tool: {
      "session-viewer": tool({
        description: "Abre una vista HTML en el browser con los archivos modificados en la sesión",
        args: {},
        async execute() {
          counter++
          const outputDir = join(directory, ".opencode", "session-views")
          mkdirSync(outputDir, { recursive: true })
          const htmlFile = join(outputDir, `session-${counter}.html`)

          let html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Session Viewer</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>hljs.highlightAll()</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d1117;color:#c9d1d9;font-family:system-ui,-apple-system,sans-serif;padding:2rem}
h1{font-size:1.5rem;margin-bottom:.5rem;color:#58a6ff}
.stats{display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap}
.stat{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:1rem;min-width:120px}
.stat-label{font-size:.75rem;color:#8b949e;text-transform:uppercase}
.stat-value{font-size:1.25rem;font-weight:600;margin-top:.25rem}
.file-card{background:#161b22;border:1px solid #30363d;border-radius:6px;margin-bottom:1rem;overflow:hidden}
.file-header{padding:.75rem 1rem;background:#1c2128;border-bottom:1px solid #30363d;display:flex;justify-content:space-between;align-items:center}
.file-name{font-family:monospace;color:#58a6ff;font-size:.9rem}
pre code.hljs{padding:1rem;font-size:.8rem;line-height:1.5;overflow-x:auto}
.empty{color:#8b949e;text-align:center;padding:3rem}
</style></head><body>
<h1>Session Viewer</h1>
<div class="stats">
<div class="stat"><div class="stat-label">Archivos</div><div class="stat-value">${files.length}</div></div>
<div class="stat"><div class="stat-label">Vista</div><div class="stat-value">#${counter}</div></div>
</div>`

          if (files.length === 0) {
            html += `<div class="empty">No se modificaron archivos en esta sesión.</div>`
          } else {
            for (const fp of files) {
              const content = readFileSync(fp, "utf-8")
              const ext = fp.split(".").pop() || ""
              html += `<div class="file-card">
<div class="file-header"><span class="file-name">${fp}</span></div>
<pre><code class="language-${ext}">${escapeHtml(content)}</code></pre></div>`
            }
          }

          html += `</body></html>`

          writeFileSync(htmlFile, html, "utf-8")

          if (process.platform === "win32") {
            await $`start "" "${htmlFile}"`
          } else if (process.platform === "darwin") {
            await $`open "${htmlFile}"`
          } else {
            await $`xdg-open "${htmlFile}"`
          }

          return `Vista abierta en el browser: ${htmlFile}`
        },
      }),
    },
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
