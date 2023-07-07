import Table from "../Components/Table/Table";

export default function UserPage() {
  return (
    <div>
      <Table
        id="user"
        title="User Memberships"
        result={{
          data: [
            { __id__: 1, test: "test" },
            { __id__: 2, test: "test" },
            { __id__: 3, test: "test" },
            { __id__: 4, test: "test" },
            { __id__: 5, test: "test" },
            { __id__: 6, test: "test" },
          ],
        }}
      />
    </div>
  );
}
