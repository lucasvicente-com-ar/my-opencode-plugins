// Credits: Lucas M. Vicente

const dangerousPatterns = [
  /rm\s+-rf\s+\//i,
  /rm\s+-rf\s+~[/\\]/i,
  /rm\s+-rf\s+\*$/i,
  /rmdir\s+\/s\s+\/q\s+c:\\/i,
  /rd\s+\/s\s+\/q\s+c:\\/i,
  /del\s+\/f\s+\/s\s+\/q\s+/i,
  /^format\s/i,
  /^diskpart/i,
  /shutdown\s+\/r/i,
  /shutdown\s+\/s/i,
  /Remove-Item.*-Recurse.*-Force/i,
  /del\s+~?\\/i,
  /reg\s+delete/i,
]

export const CommandGuardPlugin = async ({ client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        const cmd = output.args.command
        for (const pattern of dangerousPatterns) {
          if (pattern.test(cmd)) {
            throw new Error(
              `[COMMAND-GUARD] Comando bloqueado: "${cmd}"\n` +
              `Coincide con patrón peligroso: ${pattern}\n` +
              `Para desbloquear, eliminá esta regla del plugin.`
            )
          }
        }
      }
    },
  }
}