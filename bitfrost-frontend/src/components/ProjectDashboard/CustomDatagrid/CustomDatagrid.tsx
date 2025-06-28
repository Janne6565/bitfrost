import { DataGrid, type GridColDef } from "@mui/x-data-grid";

const CustomizedDataGrid = (props: {
  rows: any[];
  columns: GridColDef<any>[];
  onRowClick?: (column: any) => void;
}) => {
  return (
    <DataGrid
      rows={props.rows}
      columns={props.columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      onRowClick={(row: any, event) => {
        if (props.onRowClick) {
          props.onRowClick(row);
        }
        event.preventDefault();
        event.stopPropagation();
      }}
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      disableRowSelectionOnClick
      density="compact"
      sx={{
        borderRadius: 3,
        borderColor:
          "var(--variant-outlinedBorder, var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300, #CDD7E1)))",
        fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
      }}
      slotProps={{
        row: {
          style: props.onRowClick
            ? {
                cursor: "pointer",
              }
            : {},
        },
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
};

export default CustomizedDataGrid;
