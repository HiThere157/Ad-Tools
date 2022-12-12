import ReactMarkdown from "react-markdown"

import Type from "./Type";

type ReleaseProps = Release & {
  latest: boolean;
  installed: boolean;
};
export default function Release({
  html_url,
  name,
  body,
  prerelease,
  latest,
  installed,
  published_at,
  author,
}: ReleaseProps) {
  return (
    <div className="container flex flex-col px-2 w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold mr-1">{name}</h2>
          <Type prerelease={prerelease} latest={latest} installed={installed} />
        </div>
        <div className="flex items-center gap-2">
          <img className="h-7 rounded-lg" src={author?.avatar_url} alt="author profile"></img>
          <span className="dark:text-foregroundAccent">{author?.login}</span>
        </div>
      </div>

      <hr className="my-2 dark:border-primaryBorder" />

      <div className="pl-3 pb-2 whitespace-pre">
        {body ? (
          <ReactMarkdown>{body}</ReactMarkdown>
        ) : (
          <span className="dark:text-foregroundAccent">no release notes provided</span>
        )}
      </div>
    </div>
  );
}
