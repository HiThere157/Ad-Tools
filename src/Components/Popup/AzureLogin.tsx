import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setAzureEnvironment } from "../../Redux/environmentSlice";
import { setAzureLoginUPN } from "../../Redux/preferencesSlice";
import { loginAzure } from "../../Helper/api";

import Prompt from "./Prompt";

type AzureLoginProps = {
  isOpen: boolean;
  onExit: (status: boolean) => void;
};
export default function AzureLogin({ isOpen, onExit }: AzureLoginProps) {
  const { azureLoginUPN } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  return (
    <Prompt
      isOpen={isOpen}
      title="Azure Ad Login"
      label="UPN:"
      hint="Your Azure AD username (e.g. kochda7@example.de)"
      defaultValue={azureLoginUPN}
      onExit={async (value) => {
        if (!value) {
          onExit(false);
          return;
        }

        const env = await loginAzure(value);
        dispatch(setAzureEnvironment(env));
        dispatch(setAzureLoginUPN(value));

        onExit(true);
      }}
    />
  );
}
