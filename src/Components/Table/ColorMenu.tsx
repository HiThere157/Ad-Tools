import EditableObject from "../EditableObject";
import Hint from "../Hint";

type ColorMenuProps = {
  isOpen: boolean;
  colorSettings: ColorSettings;
  setColorSettings: (newSettings: ColorSettings) => any;
};
export default function ColorMenu({ isOpen, colorSettings, setColorSettings }: ColorMenuProps) {
  return !isOpen ? (
    <></>
  ) : (
    <div className="container w-full py-1">
      <EditableObject
        object={colorSettings}
        onChange={setColorSettings}
        type={{ value: "color" }}
        placeholder={{ key: "Pattern", value: "Color" }}
      />

      <Hint hint="Separate multiple search values per row with a pipe ( | )." />
    </div>
  );
}
