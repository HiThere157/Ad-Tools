function redirect(page: string, input: string, domain: string) {
  window.sessionStorage.setItem(
    `${page}_query`,
    JSON.stringify({ input, domain })
  );
  window.sessionStorage.setItem(`${page}_scroll`, "0");
  window.sessionStorage.setItem(`${page}_reQuery`, "true");
  window.location.hash = `#/${page}`;
}

export { redirect };
