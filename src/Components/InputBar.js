import { useEffect, useState } from "react";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import Loader from "./PulseLoader";

import { domains } from "../Config/default";

export default function InputBar({ isLoading, query, onChange, onSubmit }) {
  const [input, setInput] = useState(query.input ?? "");
  const [domain, setDomain] = useState(query.domain ?? domains[0]);

  useEffect(() => {
    onChange({ input, domain });
  }, [input, domain]);

  return (
    <div className="input-bar">
      <Input
        label="User ID:"
        value={input}
        onChange={setInput}
        onEnter={onSubmit}
      />
      <Dropdown items={domains} value={domain} onChange={setDomain} />
      <Button onClick={onSubmit} disabled={isLoading} children="Run" />
      <Loader isVisible={isLoading} />
    </div>
  );
}
