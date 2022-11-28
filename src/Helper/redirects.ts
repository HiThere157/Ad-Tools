function redirect(page: string, query: object) {
  window.sessionStorage.setItem(
    `${page}_query`,
    JSON.stringify(query)
  );
  window.sessionStorage.setItem(`${page}_scroll`, "0");
  window.sessionStorage.setItem(`${page}_reQuery`, "true");
  window.location.hash = `#/${page}`;
}

export { redirect };
