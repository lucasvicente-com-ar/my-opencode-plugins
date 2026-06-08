// Credits: Lucas M. Vicente

import { type Plugin } from "@opencode-ai/plugin"

export const LogPrefixPlugin = async ({ $, directory }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        const cmd = output.args.command;
        output.args.command = `echo "[OPENCODE] Ejecutando:"; ${cmd}";
      }
    },
  };
};