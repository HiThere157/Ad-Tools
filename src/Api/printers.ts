import { invokePSCommand } from "../Helper/api";

type GetSinglePrintersResponse = {
  printers: Promise<ResultDataSet>;
};
export function getSinglePrinters(identity: string, server: string): GetSinglePrintersResponse {
  const printers = invokePSCommand({
    command: `Get-Printer -Computername "${identity}.${server}"`,
    selectFields: ["Name", "Location", "Status", "Comment", "JobCount", "DriverName"],
  });

  return {
    printers,
  };
}
