import Table from "../Components/Table/Table";

export default function UserPage() {
  return (
    <div>
      <Table
        id="user"
        title="User Memberships"
        result={{
          data: [
            { test: "test" },
            { test: "test" },
            { test: "test" },
            { test: "test" },
            { test: "test" },
            { test: "test" },
          ],
        }}
      />
    </div>
  );
}
