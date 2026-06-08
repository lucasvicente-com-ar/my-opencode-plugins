import { type Plugin, tool } from "@opencode-ai/plugin"

export const BrowserKitPlugin: Plugin = async ({ $, directory }) => {
  return {
    tool: {
      browser: tool({
        description: "Interactúa con la web y el browser. Acciones: fetch (descargar URL), preview (abrir HTML en browser), search (buscar en la web), source (ver HTML fuente)",
        args: {
          action: tool.schema.enum(["fetch", "preview", "search", "source"]),
          url: tool.schema.string().optional().describe("URL para fetch/source"),
          query: tool.schema.string().optional().describe("Término de búsqueda para search"),
          file: tool.schema.string().optional().describe("Ruta al archivo HTML para preview"),
        },
        async execute(args) {
          switch (args.action) {
            case "fetch":
            case "source": {
              if (!args.url) return "Error: se requiere argumento 'url'"
              try {
                const res = await fetch(args.url)
                const text = await res.text()
                return text
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err)
                return `Error al obtener ${args.url}: ${msg}`
              }
            }
            case "search": {
              if (!args.query) return "Error: se requiere argumento 'query'"
              try {
                const encoded = encodeURIComponent(args.query)
                const res = await fetch(`https://html.duckduckgo.com/html/?q=${encoded}`)
                const html = await res.text()
                const results = html.match(/<a[^>]+class="result__a"[^>]*>[\s\S]*?<\/a>/gi)
                if (!results || results.length === 0) return "Sin resultados"
                const links = results.slice(0, 10).map((a: string) => {
                  const title = a.replace(/<[^>]*>/g, "").trim()
                  const href = a.match(/href="([^"]+)"/)?.[1] || ""
                  return `${title}\n  ${href}`
                }).join("\n\n")
                return `Resultados para "${args.query}":\n\n${links}`
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err)
                return `Error en la búsqueda: ${msg}`
              }
            }
            case "preview": {
              if (!args.file) return "Error: se requiere argumento 'file'"
              const fullPath = args.file.startsWith("/") || args.file.match(/^[A-Z]:/i)
                ? args.file
                : `${directory}/${args.file}`
              if (process.platform === "win32") {
                await $`start "" "${fullPath}"`
              } else if (process.platform === "darwin") {
                await $`open "${fullPath}"`
              } else {
                await $`xdg-open "${fullPath}"`
              }
              return `Abriendo ${fullPath} en el browser.`
            }
            default:
              return "Acción no soportada. Usá: fetch, preview, search o source."
          }
        },
      }),
    },
  }
}
