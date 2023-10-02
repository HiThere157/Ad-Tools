import ReactMarkdown from "react-markdown";

import ReleaseChip from "./ReleaseChip";

import { BsBoxArrowUpRight, BsClock, BsDot, BsTag, BsDownload } from "react-icons/bs";
import { BiGitBranch } from "react-icons/bi";

type ReleaseProps = {
  release: Release;
};
export default function Release({ release }: ReleaseProps) {
  const {
    name,
    body,
    published_at,
    tag_name,
    target_commitish,
    assets,
    prerelease,
    latest,
    repository,
    author,
    html_url,
  } = release;

  return (
    <div className="w-full max-w-3xl rounded border-2 border-border px-2 py-1">
      <div className="mx-1 flex items-center justify-between">
        <a
          className="group flex items-center gap-2"
          href={html_url}
          target="_blank"
          rel="noreferrer"
        >
          <h2 className="text-2xl font-bold">
            {repository}: {name}
          </h2>
          <ReleaseChip prerelease={prerelease} latest={latest} installed={false} />
          <BsBoxArrowUpRight className="hidden text-grey group-hover:block" />
        </a>

        <a
          className="flex items-center gap-2"
          href={author.html_url}
          target="_blank"
          rel="noreferrer"
        >
          <img className="h-8 rounded-lg" src={author.avatar_url} alt="author profile" />
          <span className="text-grey">{author.login}</span>
        </a>
      </div>

      <hr className="my-1.5 border-border" />

      <div className="mx-1 flex items-center text-xs text-grey">
        <div className="flex items-center gap-1">
          <BsClock className="mt-0.5" />
          <span>{published_at.replace("T", " ").replace("Z", " UTC")}</span>
        </div>
        <BsDot className="mx-1" />
        <div className="flex items-center gap-1">
          <BsTag className="mt-0.5" />
          <span>{tag_name}</span>
        </div>
        <BsDot className="mx-1" />
        <div className="flex items-center gap-1">
          <BiGitBranch className="mt-0.5" />
          <span>{target_commitish}</span>
        </div>
        <BsDot className="mx-1" />
        <div className="flex items-center gap-1">
          <BsDownload className="mt-0.5" />
          <span>{assets.reduce((downloads, asset) => downloads + asset.download_count, 0)}</span>
        </div>
      </div>

      <div className="mx-3 overflow-auto whitespace-pre">
        {body ? (
          <ReactMarkdown>{body}</ReactMarkdown>
        ) : (
          <span className="my-1 block text-grey">No Release Notes provided</span>
        )}
      </div>
    </div>
  );
}
