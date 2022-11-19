import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "../Helper/indexedDB";

import Button from "../Components/Button";

export default function GroupPage() {
  const clearSession = () => {
    window.sessionStorage.clear();
  }

  const clearLocal = () => {
    window.localStorage.clear();
  }

  const clearIndexedDB = async () => {
    try {
      const db = setupIndexedDB(commandDBConfig);
      const commandStore = new Store(db, "commands", "readwrite");
      commandStore.deleteAll();
    } catch { }
  };

  return (
    <article>
      <h2 className="text-2xl font-bold mb-1" style={{ scrollMarginTop: "60px" }}>Storage</h2>
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={clearSession}>Clear Session Storage</Button>
        <Button onClick={clearLocal}>Clear Local Storage</Button>
        <Button onClick={clearIndexedDB}>Clear indexedDB Storage</Button>
      </div>
    </article >
  );
}
