export function downloadJSON(string: string, fileName: string) {
  const a = document.createElement("a");

  a.href = URL.createObjectURL(new Blob([string], { type: "text/json" }));
  a.download = fileName;

  a.click();
}

export function uploadJSON(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "text/json";

    input.onchange = () => {
      const file = input.files?.[0];

      if (!file) {
        reject();
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.readAsText(file);
    };

    input.click();
  });
}
