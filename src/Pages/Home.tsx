import { useSessionStorage } from "../Hooks/useStorage";
import { useState, useEffect } from "react";

import { electronAPI } from "../Helper/makeAPICall";

import ScrollPosition from "../Components/ScrollPosition";
import Release from "../Components/Release/Release";
import ReleaseControl from "../Components/Release/ReleaseControl";

import { PulseLoader } from "react-spinners";
import { BsExclamationOctagon } from "react-icons/bs";

export default function HomePage() {
  const [filter, setFilter] = useSessionStorage<string>("home_filter", "All");
  const [isError, setIsError] = useState<boolean>(false);

  const [releases, setReleases] = useState<Partial<Release>[]>([]);
  const [versions, setVersions] = useState<{ [key: string]: string | undefined }>({});

  const fetchInfo = async () => {
    setVersions({
      "Ad-Tools": (await electronAPI?.getVersion())?.output?.version,
    });

    const results = await Promise.all([
      fetch("https://api.github.com/repos/HiThere157/Ad-Tools/releases"),
      // fetch("https://api.github.com/repos/HiThere157/ExcelAD/releases"),
    ]);

    if (results.some((result) => !result.ok)) {
      setIsError(true);
      return;
    }

    try {
      // get json results
      const repos = (await Promise.all(
        results.map((result) => result.json()),
      )) as Partial<Release>[][];

      // tag latest release based on repository
      repos.forEach((repo) => {
        repo
          .filter((release) => !release.prerelease)
          .forEach((release, index) => (release.latest = index === 0));
      });

      let releases = repos.flat();

      // sort merged release list by publish date
      releases = releases.sort((a, b) => {
        if (!a.published_at || !b.published_at) return 0;
        return b.published_at.localeCompare(a.published_at);
      });

      // filter invisible releases
      releases = releases.filter((release) => !release.body?.includes("[invisible]"));

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

  const refreshInfo = async () => {
    setReleases([]);
    setIsError(false);
    // improve UX by preventing only split second visibility of the loading animation
    await new Promise((r) => setInterval(r, 1000));

    fetchInfo();
  };

  return (
    <article className="flex flex-col gap-3 mt-1 items-center">
      <ReleaseControl
        filterOptions={[
          ...new Set(
            releases.reduce<string[]>(
              (repos: string[], release) => [...repos, release.repository ?? "Unknown"],
              ["All"],
            ),
          ),
        ]}
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={refreshInfo}
      />

      {releases.length === 0 && !isError && (
        <PulseLoader className="mt-10" size="12px" color="#208CF0" speedMultiplier={0.75} />
      )}

      {isError && (
        <div className="flex flex-col gap-1 items-center mt-7 text-redColor">
          <BsExclamationOctagon className="text-3xl flex-shrink-0" />
          <span>Try again later</span>
        </div>
      )}

      {releases
        .filter((release) => filter === "All" || filter === release.repository)
        .map((release, index) => {
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
              installed={release.name === versions[release.repository ?? "Unknown"]}
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
