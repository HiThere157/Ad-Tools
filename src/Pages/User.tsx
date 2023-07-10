import Table from "../Components/Table/Table";

export default function UserPage() {
  return (
    <div>
      <Table
        id="user"
        title="User Memberships"
        result={{
          data: [
            { __id__: 1, test: "t2", test1: true, test2: 3 },
            { __id__: 2, test: "t1", test1: false, test2: 2 },
            { __id__: 3, test: "t3", test1: true, test2: 1 },
            { __id__: 4, test: "t4", test1: false, test2: 4 },
            { __id__: 5, test: "t5", test1: true, test2: 5 },
            { __id__: 6, test: "t6", test1: false, test2: 6 },
            { __id__: 7, test: "t7", test1: true, test2: 7 },
            { __id__: 8, test: "t8", test1: false, test2: 8 },
            { __id__: 9, test: "t9", test1: true, test2: 9 },
            { __id__: 10, test: "t10", test1: false, test2: 10 },
            { __id__: 11, test: "t11", test1: true, test2: 11 },
            { __id__: 12, test: "t12", test1: false, test2: 12 },
            { __id__: 13, test: "t13", test1: true, test2: 13 },
            { __id__: 14, test: "t14", test1: false, test2: 14 },
            { __id__: 15, test: "t15", test1: true, test2: 15 },
            { __id__: 16, test: "t16", test1: false, test2: 16 },
            { __id__: 17, test: "t17", test1: true, test2: 17 },
            { __id__: 18, test: "t18", test1: false, test2: 18 },
          ],
        }}
      />
    </div>
  );
}
