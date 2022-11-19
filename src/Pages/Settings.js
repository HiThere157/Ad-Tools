import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "../Helper/indexedDB";

import Button from "../Components/Button";

export default function GroupPage() {
  const clearIndexedDB = async () => {
    try {
      const db = setupIndexedDB(commandDBConfig);
      const commandStore = new Store(db, "commands", "readwrite");
      commandStore.deleteAll();
    } catch {}
  };

  return (
    <div>
      <Button
        onClick={() => {
          window.sessionStorage.clear();
        }}
      >
        Clear Session Storage
      </Button>
      <Button
        onClick={() => {
          window.localStorage.clear();
        }}
      >
        Clear Local Storage
      </Button>
      <Button onClick={clearIndexedDB}>Clear indexedDB Storage</Button>
    </div>
  );
}
