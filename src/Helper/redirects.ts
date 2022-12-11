import { AadQuery, AdQuery } from "../Types/api";

function redirect(page: string, query: Partial<AadQuery | AdQuery>) {
  const currentQuery = JSON.parse(window.sessionStorage.getItem(`${page}_query`) ?? "{}");

  window.sessionStorage.setItem(`${page}_query`, JSON.stringify({ ...currentQuery, ...query }));
  window.sessionStorage.setItem(`${page}_scroll`, "0");
  window.sessionStorage.setItem(`${page}_reQuery`, "true");
  window.location.hash = `#/${page}`;
}

export { redirect };
