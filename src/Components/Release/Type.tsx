type TypeProps = {
  prerelease: boolean;
  latest: boolean;
  installed: boolean;
};
export default function Type({ prerelease, latest, installed }: TypeProps) {
  return (
    <div className="flex gap-2 my-2 select-none">
      {latest && <div className="border-2 px-3 rounded-full text-primaryControlAccent">Latest</div>}
      {prerelease && <div className="border-2 px-3 rounded-full text-errorAccent">Pre-Release</div>}
      {installed && <div className="border-2 px-3 rounded-full text-successAccent">Installed</div>}
    </div>
  );
}
