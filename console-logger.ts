import { type Plugin } from "@opencode-ai/plugin"
import { appendFileSync, mkdirSync } from "fs"
import { join } from "path"
import { homedir } from "os"

export const ConsoleLoggerPlugin: Plugin = async () => {
  const logDir = join(homedir(), "opencode-logs")
  mkdirSync(logDir, { recursive: true })

  const sessionId = new Date().toISOString().replace(/[:.]/g, "-")
  const sessionFile = join(logDir, `session_${sessionId}.log`)
  let cmdCount = 0

  appendFileSync(sessionFile, `=== SESSION START: ${new Date().toISOString()} ===\n`)

  return {
    "tool.execute.after": async (input, output) => {
      if (input.tool === "bash") {
        cmdCount++
        const ts = new Date().toISOString()
        const command = output.args.command
        const result = output.result

        const logEntry = [
          `[${cmdCount}] ${ts}`,
          `> ${command}`,
          `${result}`,
          "---",
          "",
        ].join("\n")

        appendFileSync(sessionFile, logEntry)
      }
    },
  }
}
