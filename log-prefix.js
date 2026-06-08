// Credits: Lucas M. Vicente

import { type Plugin } from "@opencode-ai/plugin"

export const LogPrefixPlugin = async ({ $, directory }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        const cmd = output.args.command;
        const ts = new Date().toLocaleTimeString();
        output.args.command = `echo "[OPENCODE ${ts}] Ejecutando:"; ${cmd}`;
      }
    },
  };
};