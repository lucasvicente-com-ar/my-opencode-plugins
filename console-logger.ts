// Credits: Lucas M. Vicente

import { type Plugin } from "@opencode-ai/plugin"

export const ConsoleLoggerPlugin: Plugin = async ({ $ }) => {
  // Crear directorio de logs si no existe
  const logDir = `${$HOME}/opencode-logs`
  await $`mkdir -p "${logDir}"`

  return {
    "tool.execute.after": async (input, output) => {
      if (input.tool === "bash") {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const logFile = `${logDir}/command_${timestamp}.log`
        
        const command = output.args.command
        const result = output.result
        
        await $`echo "=== COMMAND ===" > "${logFile}"`
        await $`echo "Time: ${new Date().toISOString()}" >> "${logFile}"`
        await $`echo "Command: ${command}" >> "${logFile}"`
        await $`echo "=== OUTPUT ===" >> "${logFile}"`
        await $`echo "${result}" >> "${logFile}"`
        await $`echo "=== END ===" >> "${logFile}"`
        
        console.log(`✅ Log guardado en: ${logFile}`)
      }
    },
  }
}