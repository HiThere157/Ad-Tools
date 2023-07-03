import EditableObject from "../EditableObject";

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
    </div>
  );
}
