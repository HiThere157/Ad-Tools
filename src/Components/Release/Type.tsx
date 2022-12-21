type TypeProps = {
  prerelease: boolean;
  latest: boolean;
  installed: boolean;
};
export default function Type({ prerelease, latest, installed }: TypeProps) {
  return (
    <>
      {(prerelease || latest || installed) && (
        <div className="flex gap-2 select-none">
          {latest && <div className="border-2 px-3 rounded-full text-elAccentBg">Latest</div>}
          {prerelease && (
            <div className="border-2 px-3 rounded-full text-redColor">Pre-Release</div>
          )}
          {installed && <div className="border-2 px-3 rounded-full text-greenColor">Installed</div>}
        </div>
      )}
    </>
  );
}
