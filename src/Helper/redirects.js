function redirectToGroup(entry, domain) {
  window.sessionStorage.setItem(
    "group_query",
    JSON.stringify({ input: entry.Name, domain: domain })
  );
  window.sessionStorage.setItem("group_scroll", 0);
  window.sessionStorage.setItem("group_reQuery", true);
  window.location.hash = "#/group";
}

export { redirectToGroup };
