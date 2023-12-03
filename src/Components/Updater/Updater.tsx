import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setPowershellEnvironment } from "../../Redux/environment";
import { getPowershellEnvironment } from "../../Helper/api";

import HeaderButton from "../Header/HeaderButton";
import Button from "../Button";
import ModuleVersion from "./ModuleVersion";

import { BsArrowRepeat, BsDownload } from "react-icons/bs";

export default function Updater() {
  const [isOpen, setIsOpen] = useState(false);
  const { adVersion, azureAdVersion } = useSelector(
    (state: RootState) => state.environment.powershell,
  );
  const dispatch = useDispatch();

  const refresh = async () => {
    const [powershellEnvironment] = await Promise.all([getPowershellEnvironment()]);

    dispatch(setPowershellEnvironment(powershellEnvironment));
  };

  return (
    <div className="winbar-no-drag relative">
      <HeaderButton onClick={() => setIsOpen(!isOpen)}>
        <BsDownload />
      </HeaderButton>

      {isOpen && (
        <div className="absolute right-0 top-9 z-40 w-60 rounded border-2 border-border bg-dark drop-shadow-custom">
          <div className="flex items-center justify-between border-b border-border bg-light p-2">
            <h3 className="text-lg font-bold">Update Manager</h3>

            <Button className="bg-dark p-0.5 text-xl" onClick={refresh}>
              <BsArrowRepeat />
            </Button>
          </div>

          <div className="p-2">
            <ModuleVersion module="ActiveDirectory" version={adVersion} />
            <ModuleVersion module="AzureAD" version={azureAdVersion} />
          </div>
        </div>
      )}
    </div>
  );
}
