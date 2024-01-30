import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setPowershellEnvironment } from "../../Redux/environmentSlice";
import { getPowershellEnvironment } from "../../Helper/api";

import Popup from "./Popup";
import Button from "../Button";
import ModuleVersion from "../Updater/ModuleVersion";

import { BsExclamationOctagon } from "react-icons/bs";

type MissingModulesProps = {
  type: "ad" | "azureAd";
};
export default function MissingModules({ type }: MissingModulesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    powershell: { adVersion, azureAdVersion },
  } = useSelector((state: RootState) => state.environment);
  const dispatch = useDispatch();

  const refresh = async () => {
    dispatch(setPowershellEnvironment({ adVersion: null, azureAdVersion: null }));

    const powershellEnvironment = await getPowershellEnvironment();

    dispatch(setPowershellEnvironment(powershellEnvironment));
  };

  useEffect(() => {
    if (type === "ad") setIsOpen(adVersion === "");
    if (type === "azureAd") setIsOpen(azureAdVersion === "");
  }, [type, adVersion, azureAdVersion]);

  return (
    <Popup isOpen={isOpen} title="Missing Modules" onCancel={() => setIsOpen(false)}>
      <div className="mx-1 flex items-center justify-center gap-2">
        <BsExclamationOctagon className="flex-shrink-0 text-2xl text-red" />
        <span className="w-96 text-red">
          A required PowerShell module is missing. Please install the module and refresh:
        </span>
      </div>

      <div className="mx-16 my-4">
        {type === "ad" && <ModuleVersion module="ActiveDirectory" version={adVersion} />}
        {type === "azureAd" && <ModuleVersion module="AzureAD" version={azureAdVersion} />}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <Button className="bg-dark" onClick={refresh}>
          Refresh
        </Button>
        <Button onClick={() => setIsOpen(false)}>Ok</Button>
      </div>
    </Popup>
  );
}
