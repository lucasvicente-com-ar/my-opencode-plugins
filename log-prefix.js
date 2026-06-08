export const LogPrefixPlugin = async () => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        const cmd = output.args.command;
        const ts = new Date().toLocaleTimeString();
        const oneLine = cmd.replace(/\n/g, "\\n").substring(0, 120);
        output.args.command = `echo "[OPENCODE ${ts}] ${oneLine}"; ${cmd}`;
      }
    },
  };
};
