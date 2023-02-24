import { useState, useEffect } from "react";

import { electronAPI } from "../Helper/makeAPICall";

import Release from "../Components/Release/Release";
import ScrollPosition from "../Components/ScrollPosition";

import { PulseLoader } from "react-spinners";
import { BsExclamationOctagon } from "react-icons/bs";

export default function HomePage() {
  const [isError, setIsError] = useState<boolean>(false);
  const [releases, setReleases] = useState<Partial<Release>[]>([]);
  const [version, setVersion] = useState<string>();

  const fetchInfo = async () => {
    setVersion((await electronAPI?.getAppVersion())?.output?.version);
    setIsError(false);
    setReleases([]);

    const result = await fetch("https://api.github.com/repos/HiThere157/Ad-Tools/releases");

    if (!result.ok) {
      setIsError(true);
      return;
    }

    try {
      let releases = (await result.json()) as Partial<Release>[];

      // filter invisible releases
      releases = releases.filter((release) => !release.body?.includes("[invisible]"));

      // tag latest release based on repository
      releases
        .filter((release) => !release.prerelease)
        .forEach((release, index) => (release.latest = index === 0));

      // get repository name for each release
      releases.forEach((release) => {
        release.repository = release.html_url?.split("/").at(-4);
      });

      setReleases(releases);
    } catch {
      setReleases([]);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <article className="flex flex-col gap-3 mt-1 items-center">
      {releases.length === 0 && !isError && (
        <PulseLoader className="mt-10" size="12px" color="#208CF0" speedMultiplier={0.75} />
      )}

      {isError && (
        <div className="flex flex-col gap-1 items-center mt-7 text-redColor">
          <BsExclamationOctagon className="text-3xl flex-shrink-0" />
          <span>Try again later</span>
        </div>
      )}

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
            latest={release.latest ?? false}
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
