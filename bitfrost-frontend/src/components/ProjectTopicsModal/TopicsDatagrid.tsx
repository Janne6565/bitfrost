import type { Topic } from "@/@types/backendTypes.ts";
import CustomDatagrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";
import { GridActionsCellItem, GridCloseIcon } from "@mui/x-data-grid";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import useApi from "@/hooks/useApi/useApi.ts";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.tsx";
import { enqueueSnackbar } from "notistack";
import { Tooltip } from "@mui/joy";

const TopicsDatagrid = (props: { topics: Topic[] }) => {
  const allSubscriptions = useTypedSelector(
    (state) => state.subscriptionSlice.subscriptions,
  );
  const { deleteTopic } = useApi();
  const { loadTopics } = useDataLoading();
  return (
    <>
      <CustomDatagrid
        rows={props.topics.map((topic) => ({ ...topic, id: topic.uuid }))}
        columns={[
          {
            field: "name",
            headerName: "Name",
            flex: 1,
            renderCell(row) {
              const topic = row.row as Topic;
              return <>{topic.label}</>;
            },
          },
          {
            field: "subscriptionCount",
            headerName: "Subscriptions",
            flex: 0.7,
            renderCell(row) {
              const topic = row.row as Topic;
              return topic.subscriptions.filter(
                (sub) => allSubscriptions[sub].state == "APPROVED",
              ).length;
            },
          },
          {
            field: "actions",
            headerName: "Remove",
            type: "actions",
            flex: 0.5,
            getActions(row) {
              return [
                <Tooltip title={"Remove Topic"} placement={"right"}>
                  <GridActionsCellItem
                    icon={<GridCloseIcon />}
                    label={"Remove Topic"}
                    onClick={() => {
                      const topic = row.row as Topic;
                      const isApproved = confirm(
                        "Are you sure you want to delete that Topic?",
                      );
                      if (isApproved) {
                        deleteTopic(topic.project, topic.label).then(
                          async () => {
                            await loadTopics();
                            enqueueSnackbar("Successfully deleted topic", {
                              variant: "success",
                            });
                          },
                        );
                      }
                    }}
                  />
                </Tooltip>,
              ];
            },
          },
        ]}
      />
    </>
  );
};

export default TopicsDatagrid;
