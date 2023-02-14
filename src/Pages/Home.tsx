import { useState, useEffect } from "react";

import { electronAPI } from "../Helper/makeAPICall";

import ScrollPosition from "../Components/ScrollPosition";
import Release from "../Components/Release/Release";

export default function HomePage() {
  const [releases, setReleases] = useState<Partial<Release>[]>([]);
  const [version, setVersion] = useState<string>("");
  const [latestIndex, setLatestIndex] = useState<number>(0);

  const fetchInfo = async () => {
    const versionResult = await electronAPI?.getVersion();
    setVersion(versionResult?.output?.version ?? "");

    const result = await fetch("https://api.github.com/repos/HiThere157/Ad-Tools/releases");
    if (!result.ok) return;
    try {
      const releases = (await result.json()) as Partial<Release>[];

      releases.forEach((release) => {
        release.repository = release.html_url?.split("/").at(-4);
      });

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
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <article className="flex flex-col gap-3 mt-4 items-center">
      {releases.map((release, index) => {
        return (
          <Release
            key={index}
            repository={release.repository ?? "Unknown"}
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
            assets={release.assets ?? []}
          />
        );
      })}
      <ScrollPosition name="home" />
    </article>
  );
}
