// Credits: Lucas M. Vicente

import { type Plugin } from "@opencode-ai/plugin"

export const ConsoleLoggerPlugin: Plugin = async ({ $ }) => {
  const logDir = `${$HOME}/opencode-logs`
  await $`mkdir -p "${logDir}"`

  const sessionId = new Date().toISOString().replace(/[:.]/g, "-")
  const sessionFile = `${logDir}/session_${sessionId}.log`
  let cmdCount = 0

  await $`echo "=== SESSION START: ${new Date().toISOString()} ===" > "${sessionFile}"`

  return {
    "tool.execute.after": async (input, output) => {
      if (input.tool === "bash") {
        cmdCount++
        const ts = new Date().toISOString()
        const command = output.args.command
        const result = output.result

        await $`echo "[${cmdCount}] ${ts}" >> "${sessionFile}"`
        await $`echo "> ${command}" >> "${sessionFile}"`
        await $`echo "${result}" >> "${sessionFile}"`
        await $`echo "---" >> "${sessionFile}"`
      }
    },
  }
}