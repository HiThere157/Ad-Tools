import { useState, useEffect } from "react";

import { electronAPI } from "../Helper/makeAPICall";

import Release from "../Components/Release/Release";

export default function HomePage() {
  const [releases, setReleases] = useState<Partial<Release>[]>([]);
  const [latestIndex, setLatestIndex] = useState<number>(0);
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
        const releases = (await result.json()) as Partial<Release>[];

        for (let i = 0; i < releases.length; i++) {
          if (!releases[i].prerelease) {
            setLatestIndex(i);
            break;
          }
        }

        setReleases(releases);
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
            tag_name={release.tag_name ?? "Unknown"}
            target_commitish={release.target_commitish ?? "Unknown"}
            name={release.name ?? "Unknown"}
            body={release.body ?? "Unknown"}
            prerelease={release.prerelease ?? false}
            latest={index === latestIndex}
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
