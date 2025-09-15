import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
  Tooltip,
} from "@mui/joy";
import Box from "@mui/joy/Box";
import type { Project } from "@/@types/backendTypes";
import { useEffect, useMemo, useState } from "react";
import { useTypedSelector } from "@/stores/rootReducer.ts"
import Option from "@mui/joy/Option";
import "./rainbowButton.css";
import useApi from "@/hooks/useApi/useApi";
import "./rainbowModal.css";


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
  if (!project || !origin) return null;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const dx = (origin?.x ?? centerX) - centerX;
  const dy = (origin?.y ?? centerY) - centerY;



  const [selectedProjectTag, setSelectedProjectTag] = useState<string | "">(""); //requesting Project
  const [selectedTopic, setSelectedTopic] = useState("");

  const allSubscriptions = useTypedSelector((state) => state.subscriptionSlice)?.subscriptions;
  const requestedSubscriptions = Object.values(allSubscriptions).filter(
    (sub) => sub.requestedProjectTag === project.projectTag && sub.requestingProjectTag === selectedProjectTag).map((sub) => sub.topicLabel); //filter for already requested subscriptions

  const allProjects = useTypedSelector((state) => state.ownedProjectSlice)?.ownedProjects;

  const allTopics = useTypedSelector((state) => state.topicSlice?.topics) || [];




  const selectedProject = allProjects.find((p: Project) => p.projectTag === selectedProjectTag); //requesting Project


  const commonLabels = useMemo(() => {
    if (!selectedProject || !project) return [];

    const selectedLabels = selectedProject.topics //Topic labels of requesting Project
      .map((uuid) => allTopics[uuid]?.label)
      .filter((label): label is string => !!label);

    const requestedLabels = project.topics //Topic labels of requested Project
      .map((uuid) => allTopics[uuid]?.label)
      .filter((label): label is string => !!label);

    return selectedLabels.filter(label => requestedLabels.includes(label)); //common labels of both Projects
  }, [selectedProject, project, allTopics]);


  const [callbackUrl, setCallbackUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const { requestProjectSubscription } = useApi()

  function closeModal() {
    setSelectedProjectTag("")
    setCallbackUrl("")
    setIsValidUrl(true)
    setSelectedTopic("")
    onClose();
  }

  async function handleSubscribe(requestingProjectTag: string, requestedProjectTag: string, label: string, callbackUrl: string) {
    const response = await requestProjectSubscription(requestingProjectTag, requestedProjectTag, label, callbackUrl);
    console.log(response)
    if (!response) {
      closeModal();
    }
  }

  const urlRegex = /^https?:\/\/[\w.-]+(?:\.[\w.-]+)*(?::\d+)?(?:[\/\w\-\._~:/?#[\]@!$&'()*+,;=]*)$/;

  useEffect(() => {
    setIsValidUrl(callbackUrl === "" || urlRegex.test(callbackUrl));
  }, [callbackUrl]);

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalDialog
        size="md"
        layout="center"
        className="rainbow-modal"
        style={
          {
            "--dx": `${dx}px`,
            "--dy": `${dy}px`
          } as React.CSSProperties
        }
      >


        <Tooltip title={"The Project " + project.projectTag + " will send you messages"}>
          <Typography level="h3" mb={1} sx={{ maxWidth: 500 }} noWrap>
            🌌 Enter the Bitfröst to {project.projectTag}
          </Typography>
        </Tooltip>

        <FormControl sx={{ mb: 2, width: "100%" }}>
          <FormLabel><Tooltip title="Your Project that will receive a Message">
            <span>Project</span>
          </Tooltip></FormLabel>
          <Select
            value={selectedProjectTag}
            onChange={(e, newValue) => {
              setSelectedProjectTag(newValue as string);
              setSelectedTopic("");
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
            <Option value=""></Option>
            {allProjects.map((proj: Project) => (
              <Option key={proj.projectTag} value={proj.projectTag}>
                <Typography noWrap title={proj.projectTag}>
                  {proj.projectTag}
                </Typography>
              </Option>
            ))}
          </Select>
        </FormControl>


        <FormControl sx={{ mb: 2, width: "100%" }}>
          <FormLabel>
            <Tooltip title="Topics need to have the same label for both Projects!">
              <span>Topics</span>
            </Tooltip>
          </FormLabel>
          <Select
            value={selectedTopic}
            onChange={(e, newValue) => setSelectedTopic(newValue as string)}
            slotProps={{
              listbox: {
                sx: {
                  "& [aria-disabled='true']": {
                    opacity: 0.5,
                    color: "text.secondary",
                    cursor: "not-allowed",
                    textDecoration: "line-through", 
                  },
                },
              },
            }}
            sx={{ width: 500 }}
          >
            <Option value=""></Option>
            {commonLabels.map((label: string) => (
              <Option key={label} value={label} disabled={requestedSubscriptions.includes(label)}>
                <Typography noWrap title={label} >
                  {label}
                </Typography>
              </Option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ mb: 2, width: "100%" }}>
          <FormLabel>
            <Tooltip title="The endpoint of your microservice that will be notified by the message broker when a subscribed event occurs. Used for asynchronous communication between services.">
              <span>Callback URL</span>
            </Tooltip>
          </FormLabel>
          <Input
            placeholder="https://yourdomain.com/callback"
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

        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="plain" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            disabled={!selectedProjectTag || !selectedTopic || !isValidUrl || !callbackUrl}
            onClick={() => {
              handleSubscribe(project.projectTag, selectedProjectTag, selectedTopic, callbackUrl);
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
