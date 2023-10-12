import { useState, useEffect } from "react";

import { useEnvironment } from "../Helper/api";

import Release from "../Components/Release/Release";

import { BsExclamationOctagon } from "react-icons/bs";
import { PulseLoader } from "react-spinners";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Release[] | null>(null);

  const env = useEnvironment();

  const fetchReleases = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch("https://api.github.com/repos/HiThere157/Ad-Tools/releases");
      if (!response.ok) {
        setError("Failed to fetch releases");
      }

      const rawReleases = (await response.json()) as Omit<Release, "latest" | "repository">[];
      const releases = [] as Release[];

      rawReleases.forEach((rawRelease) => {
        // Skip invisible releases
        if (rawRelease.body.includes("[invisible]")) return;

        // If there are no previous full releases and this is a not a prerelease, mark it as the latest release
        // The Repository is the 4th last item in the URL
        const release = {
          ...rawRelease,
          latest: !releases.some((r) => r.latest) && !rawRelease.prerelease,
          repository: rawRelease.html_url.split("/").at(-4) ?? "",
        };

        releases.push(release);
      });

      setResult(releases);
    } catch {
      setError("Failed to parse releases");
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-2">
      {error && (
        <div className="my-2 flex items-center justify-center gap-2">
          <BsExclamationOctagon className="flex-shrink-0 text-2xl text-red" />
          <span className="text-red">{error}</span>
        </div>
      )}

      {result === null && !error && (
        <div className="my-3 flex justify-center">
          <PulseLoader color="#208cf0" speedMultiplier={0.7} size={13} />
        </div>
      )}

      {result?.map((release, releaseIndex) => (
        <Release
          key={releaseIndex}
          release={release}
          installed={release.tag_name === env.appVersion}
        />
      ))}
    </div>
  );
}
