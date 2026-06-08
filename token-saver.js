// Credits: Lucas M. Vicente

const MAX_LINES = 100
const HEAD_TAIL = 40

export const TokenSaverPlugin = async () => {
  return {
    "tool.execute.after": async (input, output) => {
      if (input.tool === "bash" && typeof output.result === "string") {
        const lines = output.result.split("\n")
        if (lines.length > MAX_LINES) {
          const head = lines.slice(0, HEAD_TAIL)
          const tail = lines.slice(-HEAD_TAIL)
          const removed = lines.length - HEAD_TAIL - HEAD_TAIL
          output.result = [
            ...head,
            `... (${removed} líneas truncadas para ahorrar tokens)`,
            ...tail,
          ].join("\n")
        }
      }
    },
  }
}