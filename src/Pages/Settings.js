import Button from "../Components/Button";

export default function GroupPage() {
  return (
    <div>
      <Button
        onClick={() => {
          window.sessionStorage.clear();
        }}
      >
        Clear Session Storage
      </Button>
      <Button
        onClick={() => {
          window.localStorage.clear();
        }}
      >
        Clear Local Storage
      </Button>
    </div>
  );
}
