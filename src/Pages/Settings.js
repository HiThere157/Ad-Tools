import Button from "../Components/Button";

export default function GroupPage() {
  const clearLocalStorage = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  };

  return (
    <div className="text-xl">
      <Button onClick={clearLocalStorage}>Clear Storage</Button>
    </div>
  );
}
