import type { User } from "@/@types/backendTypes.ts";
import CustomDatagrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";
import { GridActionsCellItem, GridCloseIcon } from "@mui/x-data-grid";

const MemberDatagrid = (props: {
  user: User[];
  removeUserCallback: (user: User) => Promise<void>;
}) => {
  return (
    <CustomDatagrid
      rows={props.user.map((user) => ({ ...user, id: user.uuid }))}
      columns={[
        {
          field: "name",
          headerName: "Name",
          flex: 0.5,
          renderCell(row) {
            return <>{row.row.name}</>;
          },
        },
        {
          field: "email",
          headerName: "Email",
          flex: 1,
          renderCell(row) {
            return <>{row.row.email}</>;
          },
        },
        {
          field: "actions",
          headerName: "Revoke",
          type: "actions",
          flex: 0.5,
          getActions(row) {
            return [
              <GridActionsCellItem
                icon={<GridCloseIcon />}
                label={"Revoke Access"}
                onClick={() => {
                  props.removeUserCallback(row.row);
                }}
              />,
            ];
          },
        },
      ]}
    />
  );
};

export default MemberDatagrid;
