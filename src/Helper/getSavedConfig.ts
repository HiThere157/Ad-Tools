import { electronAPI } from "./makeAPICall";

async function getDomains(): Promise<string[]> {
  // look for stored domains in localstorage
  const stored = localStorage.getItem("conf_domains");
  let domains;
  try {
    domains = JSON.parse(stored ?? "[]");
  } catch {
    domains = [];
  }

  // if no result, lookup dns domain suffix list
  if (domains.length === 0) {
    const result = await electronAPI?.getDomainSuffixList();
    const output = result?.output as { SuffixSearchList?: string[] };

    if (output?.SuffixSearchList) {
      domains = output.SuffixSearchList;
    }
  }

  // if still no result, use placeholder
  if (domains.length === 0) {
    domains = ["example.com"];
  }

  setDomains(domains);
  return domains;
}

function setDomains(domains: string[]) {
  localStorage.setItem("conf_domains", JSON.stringify(domains));
}

export { getDomains, setDomains };
