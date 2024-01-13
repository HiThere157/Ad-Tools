import { invokePSCommand } from "../Helper/api";

export function getPrinters(identity: string, server: string, printerFields: string[] = []) {
  const printers = invokePSCommand({
    command: `Get-Printer -Computername "${identity}.${server}"`,
    selectFields: printerFields,
  });

  return {
    printers,
  };
}
