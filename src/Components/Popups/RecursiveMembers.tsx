import { useState, useEffect } from "react";

import { makeAPICall } from "../../Helper/makeAPICall";
import { makeToList } from "../../Helper/postProcessors";

import Popup from "./Popup";
import Button from "../Button";

import { PulseLoader } from "react-spinners";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { BsExclamationOctagon } from "react-icons/bs";

type RecursiveMembersProps = {
  query: AdQuery;
  isOpen: boolean;
  onExit: () => any;
};
export default function RecursiveMembers({ query, isOpen, onExit }: RecursiveMembersProps) {
  return (
    <Popup
      title={"Group: " + (query.input ?? "")}
      className="w-[50%] min-w-[35rem] top-[8%] max-h-[85%] overflow-auto"
      isOpen={isOpen}
      onExit={onExit}
    >
      <Member query={query} type="group" depth={0} />
    </Popup>
  );
}

type MemberProps = {
  query: AdQuery;
  type: string;
  depth: number;
};
function Member({ query, type, depth }: MemberProps) {
  const [members, setMembers] = useState<Result<{ query: AdQuery; type: string }[]>>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const runQuery = async () => {
    setIsLoading(true);

    setMembers({ output: [] });

    if (depth > 20) {
      setMembers({ error: "Max depth exceeded." });
      return;
    }

    await makeAPICall<PSResult[]>({
      command: "Get-ADGroupMember",
      args: {
        Identity: query.input,
        Server: query.domain,
      },
      postProcessor: makeToList,
      callback: (result: Result<PSResult[]>) => {
        setMembers({
          output: result.output
            ?.map((result) => {
              return {
                query: { input: result.Name?.toString(), domain: query.domain?.toString() },
                type: result.ObjectClass?.toString(),
              };
            })
            .sort((result) => (result.type === "group" ? 1 : -1)),
          error: result.error,
        });
      },
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (type === "group") runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (type !== "group") return <div>{query.input}</div>;

  return (
    <div>
      <Button
        className="flex items-center w-full my-1 border-0 text-whiteColorAccent"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="text-xl mr-1">{isCollapsed ? <FiChevronDown /> : <FiChevronUp />}</div>

        <span>{query.input}</span>
      </Button>

      {!isCollapsed && (
        <div className="flex flex-row">
          <div className="mx-3">
            <Button
              className="p-0 h-full opacity-50"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </div>

          <div className="w-full">
            {isLoading && !members.error && (
              <PulseLoader size="7px" color="#208CF0" speedMultiplier={0.75} />
            )}

            {members.error && (
              <div className="flex items-center space-x-2 text-redColor">
                <BsExclamationOctagon className="text-lg flex-shrink-0" />
                <span>{members.error}</span>
              </div>
            )}

            {members.output?.map((member, index) => (
              <Member key={index} query={member.query} type={member.type} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
