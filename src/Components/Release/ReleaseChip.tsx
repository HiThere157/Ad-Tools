type ReleaseChipProps = {
  prerelease: boolean;
  latest: boolean;
  installed: boolean;
};
export default function ReleaseChip({ prerelease, latest, installed }: ReleaseChipProps) {
  return (
    <div className="flex gap-2">
      {latest && <div className="rounded-full border-2 px-3 text-primaryAccent">Latest</div>}
      {prerelease && <div className="rounded-full border-2 px-3 text-red">Pre-Release</div>}
      {installed && <div className="rounded-full border-2 px-3 text-green">Installed</div>}
    </div>
  );
}
