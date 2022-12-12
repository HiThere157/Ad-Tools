import { useState, useEffect } from "react";

import { electronAPI } from "../Helper/makeAPICall";

import Release from "../Components/Release/Release";

export default function HomePage() {
  const [releases, setReleases] = useState<Partial<Release>[]>([]);
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    (async () => {
      const result = await electronAPI?.getVersion();
      setVersion(result?.output ?? "");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await fetch("https://api.github.com/repos/HiThere157/Ad-Tools/releases");

      if (!result.ok) return;
      try {
        setReleases(await result.json());
      } catch {
        setReleases([]);
      }
    })();
  }, []);

  return (
    <article className="flex flex-col gap-3 mt-4 items-center">
      {releases.map((release, index) => {
        return (
          <Release
            key={index}
            html_url={release.html_url ?? ""}
            name={release.name ?? "Unknown"}
            body={release.body ?? "Unknown"}
            prerelease={release.prerelease ?? false}
            latest={index === 0}
            installed={release.name === version}
            published_at={release.published_at ?? "Unknown"}
            author={
              release.author ?? {
                login: "Unknown",
                avatar_url: "",
                html_url: "",
              }
            }
          />
        );
      })}
    </article>
  );
}
