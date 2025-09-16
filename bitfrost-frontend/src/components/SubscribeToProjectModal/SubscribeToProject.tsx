import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Select,
  Tooltip,
  Typography,
} from "@mui/joy";
import Box from "@mui/joy/Box";
import type { Project } from "@/@types/backendTypes";
import { useEffect, useMemo, useState } from "react";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import Option from "@mui/joy/Option";
import "./rainbowButton.css";
import useApi from "@/hooks/useApi/useApi";
import "./rainbowModal.css";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.tsx";
import { enqueueSnackbar } from "notistack";

interface ProjectSubscribeModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  origin: { x: number; y: number } | null;
}

export default function ProjectSubscribeModal({
  open,
  onClose,
  project,
  origin,
}: ProjectSubscribeModalProps) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const dx = (origin?.x ?? centerX) - centerX;
  const dy = (origin?.y ?? centerY) - centerY;

  const [selectedProjectTag, setSelectedProjectTag] = useState<string | "">(""); //requesting Project
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const allSubscriptions = useTypedSelector(
    (state) => state.subscriptionSlice,
  )?.subscriptions;
  const requestedSubscriptions = useMemo(
    () =>
      Object.values(allSubscriptions)
        .filter(
          (sub) =>
            sub.requestedProjectTag === project?.projectTag &&
            sub.requestingProjectTag === selectedProjectTag,
        )
        .map((sub) => sub.topicLabel),
    [allSubscriptions, project?.projectTag, selectedProjectTag],
  ); //filter for already requested subscriptions

  const allOwnedProjects: Project[] = Object.values(
    useTypedSelector((state) => state.ownedProjectSlice?.ownedProjects),
  ).sort((project1, project2) =>
    project1.projectTag.toLowerCase() > project2.projectTag.toLowerCase()
      ? 1
      : -1,
  );

  const allTopics = useTypedSelector((state) => state.topicSlice?.topics);

  const requestedTopicsLabels = useMemo(
    () =>
      (project?.topics ?? [])
        .map((uuid) => allTopics[uuid]?.label)
        .filter((label): label is string => !!label),
    [project, allTopics],
  );

  const [callbackUrl, setCallbackUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const { requestProjectSubscription } = useApi();
  const { loadSubscriptions } = useDataLoading();

  useEffect(() => {
    const urlRegex =
      /^https?:\/\/[\w.-]+(?:\.[\w.-]+)*(?::\d+)?[\/\w\-\._~:\/?#[\]@!$&'()*+,;=]*$/;
    setIsValidUrl(callbackUrl === "" || urlRegex.test(callbackUrl));
  }, [callbackUrl]);

  const handleSubscribe = async (
    requestingProjectTag: string,
    requestedProjectTag: string,
    label: string,
    callbackUrl: string,
  ) => {
    setLoading(true);
    const response = await requestProjectSubscription(
      requestingProjectTag,
      requestedProjectTag,
      label,
      callbackUrl,
    );

    if (!response) {
      await loadSubscriptions();
      closeModal();
      enqueueSnackbar("", {
        variant: "success",
        content: () => (
          <div className="rainbow-snackbar" style={{ padding: "8px 16px" }}>
            <Typography>
              You opened the Bitfröst Portal 🌌, <br></br> waiting for approval
              from the other side...
            </Typography>
          </div>
        ),
      });
    } else {
      setLoading(false);
    }
  };

  if (!project || !origin) return null;

  function closeModal() {
    setSelectedProjectTag("");
    setCallbackUrl("");
    setIsValidUrl(true);
    setSelectedTopic("");
    setLoading(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalDialog
        size="md"
        layout="center"
        className="rainbow-modal"
        style={
          {
            "--dx": `${dx}px`,
            "--dy": `${dy}px`,
          } as React.CSSProperties
        }
      >
        <Tooltip
          title={
            "The Project " + project.projectTag + " will send you messages"
          }
          placement={"left"}
        >
          <Typography level="h3" mb={1} sx={{ maxWidth: 500 }} noWrap>
            🌌 Open your Bitfröst for{" "}
            <code style={{ fontWeight: "normal" }}>{project.projectTag}</code>
          </Typography>
        </Tooltip>

        <FormControl sx={{ mb: 2, width: "100%" }}>
          <FormLabel>
            <Tooltip
              title="The Project which will receive the events"
              placement={"left"}
            >
              <span>Subscribing Project</span>
            </Tooltip>
          </FormLabel>
          <Select
            value={selectedProjectTag}
            onChange={(_e, newValue) => {
              setSelectedProjectTag(newValue as string);
            }}
            slotProps={{
              listbox: {
                sx: {
                  width: 500,
                  wordBreak: "break-word",
                },
              },
            }}
            sx={{
              width: 500,
            }}
          >
            <Option value="" disabled>
              <Typography color={"neutral"}>Please select a project</Typography>
            </Option>
            {allOwnedProjects.map((proj: Project) => (
              <Option key={proj.projectTag} value={proj.projectTag}>
                <Typography noWrap title={proj.projectTag}>
                  {proj.projectTag}
                </Typography>
              </Option>
            ))}
          </Select>
          {project.projectTag === selectedProjectTag && (
            <Typography
              color={"warning"}
              level={"body-sm"}
              sx={{ pt: 1, width: "80%" }}
            >
              Warning: You are subscribing to your own Topic, make sure this is
              intentional
            </Typography>
          )}
        </FormControl>

        <FormControl sx={{ mb: 2, width: "100%" }}>
          <FormLabel>
            <Tooltip
              title={
                "The Topic of " +
                project.projectTag +
                " you want to subscribe to"
              }
              placement={"left"}
            >
              <span>Topic to beam to</span>
            </Tooltip>
          </FormLabel>
          <Select
            value={selectedTopic}
            onChange={(_e, newValue) => setSelectedTopic(newValue as string)}
            sx={{ width: 500 }}
          >
            <Option value="" disabled>
              <Typography color={"neutral"}>Please select a topic</Typography>
            </Option>
            {requestedTopicsLabels.map((label: string) => (
              <Option
                key={label}
                value={label}
                disabled={requestedSubscriptions.includes(label)}
              >
                <Tooltip
                  title={
                    requestedSubscriptions.includes(label)
                      ? "You already have a subscription for that topic"
                      : ""
                  }
                >
                  <Typography
                    noWrap
                    title={label}
                    color={
                      requestedSubscriptions.includes(label)
                        ? "neutral"
                        : undefined
                    }
                  >
                    {label}
                  </Typography>
                </Tooltip>
              </Option>
            ))}
          </Select>
          {requestedSubscriptions.includes(selectedTopic) && (
            <Typography color={"danger"} level={"body-sm"} sx={{ pt: 1 }}>
              You have already opened the bitfröst to that topic
            </Typography>
          )}
        </FormControl>

        <FormControl sx={{ mb: 2, width: "100%" }}>
          <FormLabel>
            <Tooltip
              placement={"left"}
              title="The endpoint of your microservice that will be notified by the message broker when a event occurs. Used for asynchronous communication between services."
            >
              <span>Callback URL</span>
            </Tooltip>
          </FormLabel>
          <Input
            placeholder="https://valhalla.asgard/yggdrasil/callback"
            value={callbackUrl}
            onChange={(e) => setCallbackUrl(e.target.value)}
            color={isValidUrl ? "neutral" : "danger"}
          />
          {!isValidUrl && (
            <Typography level="body-xs" color="danger">
              Invalid URL format
            </Typography>
          )}
        </FormControl>

        <Box
          mt={3}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button variant="plain" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            disabled={
              !selectedProjectTag ||
              !selectedTopic ||
              !isValidUrl ||
              !callbackUrl ||
              loading ||
              requestedSubscriptions.includes(selectedTopic)
            }
            onClick={() => {
              handleSubscribe(
                selectedProjectTag,
                project.projectTag,
                selectedTopic,
                callbackUrl,
              );
            }}
            className="rainbow-button"
          >
            Enter 🌈
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
