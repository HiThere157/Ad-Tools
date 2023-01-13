import { useLocalStorage } from "../Hooks/useStorage";

import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "../Helper/indexedDB";
import { useGlobalState } from "../Hooks/useGlobalState";
import { addMessage } from "../Helper/handleMessage";

import Button from "../Components/Button";
import EditableList from "../Components/EditableList";

export default function GroupPage() {
  const { setState } = useGlobalState();
  const [domains, setDomains] = useLocalStorage<string[]>("conf_domains", []);

  const clearSession = () => {
    window.sessionStorage.clear();
    addMessage({ type: "info", message: "cleared session storage", timer: 7 }, setState);
  };
  const clearLocal = () => {
    window.localStorage.clear();
    addMessage({ type: "info", message: "cleared local storage", timer: 7 }, setState);
  };
  const clearIndexedDB = async () => {
    try {
      const db = setupIndexedDB(commandDBConfig);
      const commandStore = new Store(db, "commands", "readwrite");
      commandStore.deleteAll();
      addMessage({ type: "info", message: "cleared indexedDB", timer: 7 }, setState);
    } catch {
      addMessage({ type: "error", message: "failed to clear indexedDB" }, setState);
    }
  };

  const updateDomains = (newDomains: string[]) => {
    addMessage(
      {
        type: "info",
        message: "Domain list was updated",
        timer: 7,
        skipIfExists: true,
      },
      setState,
    );
    setDomains(newDomains);
  };

  return (
    <article className="flex flex-col space-y-5">
      <section>
        <h2 className="text-2xl font-bold mb-1" style={{ scrollMarginTop: "60px" }}>
          Domain Settings
        </h2>
        <EditableList
          items={domains}
          onChange={updateDomains}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-1" style={{ scrollMarginTop: "60px" }}>
          Storage
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Button onClick={clearSession}>Clear Session Storage</Button>
          <Button onClick={clearLocal}>Clear Local Storage</Button>
          <Button onClick={clearIndexedDB}>Clear indexedDB Storage</Button>
        </div>
      </section>
    </article>
  );
}
