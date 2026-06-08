const dangerousPatterns = [
  // Linux/macOS
  /rm\s+-rf\s+\//i,
  /rm\s+-rf\s+~[/\\]/i,
  /rm\s+-rf\s+\*$/i,
  /^format\s/i,
  /^diskpart/i,
  /shutdown\s+\/r/i,
  /shutdown\s+\/s/i,
  />\s*\/dev\/sda/i,

  // Windows cmd
  /rmdir\s+\/s\s+\/q\s+c:\\/i,
  /rd\s+\/s\s+\/q\s+c:\\/i,
  /del\s+\/f\s+\/s\s+\/q\s+/i,
  /del\s+~?\\/i,
  /reg\s+delete/i,
  /cipher\s+\/w/i,
  /bcdedit/i,
  /fsutil\s+/i,
  /takeown\s+\/f/i,
  /icacls\s+.*\/grant/i,
  /schtasks\s+\/create/i,

  // PowerShell
  /Remove-Item.*-Recurse.*-Force/i,
  /Remove-Item.*-LiteralPath.*-Recurse.*-Force/i,
  /Clear-Host/i,
  /wmic\s+.*delete/i,
  /Get-WmiObject.*Win32_ShadowCopy.*Remove/i,
  /net\s+user\s+\/add/i,
  /net\s+localgroup\s+.*\/add/i,
  /Set-ExecutionPolicy\s+/i,
  /Stop-Computer/i,
  /Restart-Computer/i,
  /Add-LocalGroupMember/i,
  /Remove-LocalUser/i,
]

export const CommandGuardPlugin = async () => {
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
