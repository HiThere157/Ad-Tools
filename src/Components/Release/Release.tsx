import ReactMarkdown from "react-markdown";

import Type from "./Type";
import Link from "../Link";

import { BsBoxArrowUpRight, BsDot, BsTag } from "react-icons/bs";
import { BiGitBranch } from "react-icons/bi";

type ReleaseProps = Release & {
  latest: boolean;
  installed: boolean;
};
export default function Release({
  html_url,
  tag_name,
  target_commitish,
  name,
  body,
  prerelease,
  latest,
  installed,
  published_at,
  author,
}: ReleaseProps) {
  return (
    <div className="container flex flex-col px-2 py-1 w-full max-w-3xl">
      <div className="flex items-center justify-between whitespace-nowrap ml-1">
        <Link className="group flex items-center gap-2" href={html_url}>
          <h2 className="text-2xl font-bold">{name}</h2>
          <Type prerelease={prerelease} latest={latest} installed={installed} />
          <BsBoxArrowUpRight className="group-hover:scale-100 scale-0" />
        </Link>

        <Link className="flex items-center gap-2" href={author.html_url}>
          <img className="h-8 rounded-lg" src={author.avatar_url} alt="author profile"></img>
          <span className="dark:text-foregroundAccent">{author.login}</span>
        </Link>
      </div>

      <hr className="my-1.5 dark:border-primaryBorder" />

      <div className="flex items-center text-xs text-foregroundAccent ml-1">
        <span>{published_at.replace("T", " ").replace("Z", " UTC")}</span>
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
      </div>

      <div className="pl-3 pb-1 whitespace-pre overflow-auto">
        {body ? (
          <ReactMarkdown>{body}</ReactMarkdown>
        ) : (
          <span className="block dark:text-foregroundAccent my-1">no release notes provided</span>
        )}
      </div>
    </div>
  );
}
