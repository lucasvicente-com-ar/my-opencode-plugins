import { type Plugin, tool } from "@opencode-ai/plugin"
import { mkdirSync, writeFileSync } from "fs"
import { join } from "path"

export const WebNavPlugin: Plugin = async ({ $, directory }) => {
  let history: string[] = []

  return {
    tool: {
      "web-nav": tool({
        description: "Navegá páginas web desde opencode. Acciones: goto, fetch, dashboard, history",
        args: {
          action: tool.schema.enum(["goto", "fetch", "dashboard", "history"]),
          url: tool.schema.string().optional(),
        },
        async execute(args) {
          const { action, url } = args

          if (action === "history") {
            if (history.length === 0) return "No hay URLs visitadas aún."
            return `Historial de navegación:\n${history.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}`
          }

          if (action === "goto") {
            if (!url) return "Error: se requiere url"
            history.push(url)
            if (process.platform === "win32") {
              await $`start "" "${url}"`
            } else if (process.platform === "darwin") {
              await $`open "${url}"`
            } else {
              await $`xdg-open "${url}"`
            }
            return `Abriendo ${url} en el browser.`
          }

          if (action === "fetch") {
            if (!url) return "Error: se requiere url"
            history.push(url)
            try {
              const res = await fetch(url)
              const content = await res.text()
              const lines = content.split("\n").length
              return lines > 200
                ? `Contenido de ${url} (${content.length} chars, ${lines} líneas):\n\n${content.slice(0, 5000)}\n\n... (truncado, usá action=fetch sin preview para completo)`
                : content
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err)
              return `Error al obtener ${url}: ${msg}`
            }
          }

          if (action === "dashboard") {
            const htmlFile = join(directory, ".opencode", "web-dashboard.html")
            const links = history.length > 0
              ? history.map((u, i) => `<li><a href="${u}" target="_blank">${i + 1}. ${u}</a></li>`).join("\n")
              : "<li style='color:#8b949e'>Todavía no visitaste ninguna URL</li>"

            const html = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Web Dashboard</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d1117;color:#c9d1d9;font-family:system-ui,sans-serif;padding:2rem;max-width:800px;margin:auto}
h1{font-size:1.5rem;margin-bottom:1rem;color:#58a6ff}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem}
h2{font-size:1rem;margin-bottom:.75rem;color:#c9d1d9}
input,button{padding:.6rem .8rem;border-radius:6px;border:1px solid #30363d;font-size:.9rem}
input{flex:1;background:#0d1117;color:#c9d1d9;min-width:0}
button{background:#238636;color:#fff;border:none;cursor:pointer;white-space:nowrap}
button:hover{background:#2ea043}
.url-bar{display:flex;gap:.5rem;margin-bottom:.5rem}
label{display:block;font-size:.8rem;color:#8b949e;margin-bottom:.3rem}
ol{padding-left:1.5rem}
li{margin-bottom:.4rem}
a{color:#58a6ff;text-decoration:none}
a:hover{text-decoration:underline}
.actions{display:flex;gap:.5rem;flex-wrap:wrap}
.actions button{background:#21262d;border:1px solid #30363d}
.actions button:hover{background:#30363d}
.note{font-size:.8rem;color:#8b949e;margin-top:.75rem}
</style></head><body>
<h1>Web Dashboard</h1>
<div class="card">
<h2>Navegar a una URL</h2>
<div class="url-bar">
<input type="text" id="urlInput" placeholder="https://..." onkeydown="if(event.key==='Enter')openUrl()">
<button onclick="openUrl()">Ir</button>
</div>
<label>Escribí una URL y presioná Enter o hacé clic en "Ir"</label>
</div>
<div class="card">
<h2>Historial de navegación</h2>
<ol>${links}</ol>
<div class="actions" style="margin-top:.75rem">
<button onclick="window.open('https://duckduckgo.com','_blank')">DuckDuckGo</button>
<button onclick="window.open('https://github.com','_blank')">GitHub</button>
<button onclick="window.open('https://opencode.ai','_blank')">OpenCode</button>
</div>
</div>
<div class="card">
<h2>Comandos rápidos</h2>
<p style="margin-bottom:.5rem;color:#8b949e;font-size:.9rem">En opencode podés usar:</p>
<code style="display:block;background:#1c2128;padding:.5rem .8rem;border-radius:4px;margin-bottom:.3rem;font-size:.85rem">web-nav action=fetch url="https://..."</code>
<code style="display:block;background:#1c2128;padding:.5rem .8rem;border-radius:4px;margin-bottom:.3rem;font-size:.85rem">web-nav action=goto url="https://..."</code>
<code style="display:block;background:#1c2128;padding:.5rem .8rem;border-radius:4px;font-size:.85rem">web-nav action=history</code>
</div>
<script>
function openUrl() {
  const url = document.getElementById('urlInput').value.trim()
  if (url) window.open(url, '_blank')
}
</script>
</body></html>`

            mkdirSync(join(directory, ".opencode"), { recursive: true })
            writeFileSync(htmlFile, html, "utf-8")

            if (process.platform === "win32") {
              await $`start "" "${htmlFile}"`
            } else {
              await $`xdg-open "${htmlFile}" 2>/dev/null || open "${htmlFile}"`
            }

            return `Dashboard abierto en el browser: ${htmlFile}`
          }

          return `Acción no reconocida. Usá: goto, fetch, dashboard, history`
        },
      }),
    },
  }
}
