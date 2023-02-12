import { useLocalStorage } from "../Hooks/useStorage";

import { electronAPI } from "../Helper/makeAPICall";
import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "../Helper/indexedDB";
import { useGlobalState } from "../Hooks/useGlobalState";
import { addMessage } from "../Helper/handleMessage";

import Button from "../Components/Button";
import EditableList from "../Components/EditableList";

export default function GroupPage() {
  const { setState } = useGlobalState();

  const [domains, setDomains] = useLocalStorage<string[]>("conf_domains", []);
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

  const checkForUpdate = async () => {
    if (!electronAPI) {
      addMessage({ type: "error", message: "failed to check for updates" }, setState);
      return;
    }

    electronAPI?.checkForUpdate();
    addMessage({ type: "info", message: "checking for updates", timer: 7 }, setState);
  };

  return (
    <article className="flex flex-col gap-y-5 max-w-5xl">
      <section>
        <h2 className="text-2xl font-bold mb-1" style={{ scrollMarginTop: "60px" }}>
          Domain Settings
        </h2>
        <EditableList items={domains} onChange={updateDomains} />
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

      <section>
        <h2 className="text-2xl font-bold mb-1" style={{ scrollMarginTop: "60px" }}>
          Update
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Button theme="color" onClick={checkForUpdate}>
            Check for Updates
          </Button>
        </div>
      </section>
    </article>
  );
}
