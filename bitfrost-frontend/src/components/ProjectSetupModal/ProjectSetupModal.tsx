import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import type { Project } from "@/@types/backendTypes.ts";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { CopyAll, Info, RotateLeft } from "@mui/icons-material";
import useApi from "@/hooks/useApi/useApi.ts";
import { useState } from "react";
import ApprovalModal from "@/components/ApprovalModal/ApprovalModal.tsx";
import { enqueueSnackbar } from "notistack";

const ProjectSetupModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
}) => {
  const { refreshProjectAccessSecret } = useApi();
  const [secret, setSecret] = useState<string | null>(null);
  const [isSecretLoading, setSecretLoading] = useState(false);
  const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
  const [isCopied, setCopied] = useState(false);
  const handleSecretChange = () => {
    setSecretLoading(true);
    refreshProjectAccessSecret(props.project.projectTag).then((res) => {
      if (res) {
        setCopied(false);
        setSecret(res);
      }
      setSecretLoading(false);
    });
  };

  return (
    <GenericModal
      header={"Setup Application"}
      open={props.isOpen}
      setOpen={props.setOpen}
      modalDialogSX={{ width: "65vw" }}
    >
      <Card variant={"soft"} color={"neutral"}>
        <CardContent>
          <Stack direction={"row"} gap={"20px"} alignItems={"center"}>
            <Info fontSize={"large"} />
            <Box>
              <Typography level="body-md">
                Here you will learn how you can integrate your application to
                send events through the Bitfröst.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card variant={"soft"} color={"neutral"}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <Typography
            color={"neutral"}
            level={"body-sm"}
            sx={{ userSelect: "none" }}
          >
            1. Generic Information
          </Typography>
          <Typography level="body-md">
            To publish an event you need to send a post request to the following
            endpoint:
          </Typography>
          <code
            style={{
              background: "rgba(0,0,0,0.05)",
              borderRadius: "4px",
              fontSize: "14px",
              padding: "10px",
              userSelect: "all",
            }}
          >
            POST https://bitfrost.sau-portal.de/api/v1/messages/publish/{"{"}
            service-name{"}"}/{"{"}topic-name{"}"}
          </code>
          <Typography level="body-md">
            The service-name is the name of the project you want to publish
            events to. The topic-name is the name of the topic you want to
            publish the event to. An example would look like this:
          </Typography>
          <code
            style={{
              background: "rgba(0,0,0,0.05)",
              borderRadius: "4px",
              fontSize: "14px",
              padding: "10px",
              userSelect: "all",
            }}
          >
            POST
            https://bitfrost.sau-portal.de/api/v1/messages/publish/MyAwesomeService/user:signup
          </code>
          <Typography level="body-md">
            The content of the request body is the payload of the event which
            will be published.
          </Typography>
        </CardContent>
      </Card>
      <Card variant={"soft"} color={"neutral"}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <Typography
            color={"neutral"}
            level={"body-sm"}
            sx={{ userSelect: "none" }}
          >
            2. Authentication
          </Typography>
          <Typography>
            The endpoint expects you to send a header containing the Project Tag
            and the Project Secret like this:
          </Typography>
          <code
            style={{
              background: "rgba(0,0,0,0.05)",
              borderRadius: "4px",
              fontSize: "14px",
              padding: "10px",
              userSelect: "all",
            }}
          >
            {'"Authorization": "Executor {project-tag}:{project-secret}"'}
          </code>
          <Typography level="body-md">
            The project-secret can be found below.
          </Typography>
        </CardContent>
      </Card>

      <Typography
        level={"body-sm"}
        sx={{ mt: "5px", userSelect: "none" }}
        color={"neutral"}
      >
        Project Secret for <code>{props.project.projectTag}</code>:
      </Typography>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Tooltip
          title={
            secret
              ? null
              : "For Security reasons you need to regenerate your Project Access Token everytime you want to see it"
          }
        >
          <code
            style={{
              filter: secret ? undefined : "blur(2px)",
              userSelect: secret ? "inherit" : "none",
              cursor: secret ? "inherit" : "not-allowed",
              transition: "all ease .5s",
              transitionDelay: "0.2s",
              background: "rgba(0,0,0,0.05)",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {secret ?? "BridgeOfFlamesAndLight"}
            <Tooltip title={secret ? "Copy Secret" : null}>
              <IconButton
                disabled={!secret || isCopied}
                variant={"soft"}
                onClick={() => {
                  navigator.clipboard.writeText(secret ?? "").then(() => {
                    setCopied(true);
                    enqueueSnackbar("Copied Project Secret to clipboard", {
                      variant: "success",
                    });
                  });
                }}
              >
                <CopyAll />
              </IconButton>
            </Tooltip>
          </code>
        </Tooltip>
        <Tooltip title={"Reload Project Secret"}>
          <Button
            onClick={() => {
              setApprovalModalOpen(true);
            }}
            variant={"soft"}
            sx={{
              transition: "all ease .2s",
              height: "56px",
            }}
            disabled={isSecretLoading}
          >
            <RotateLeft />
          </Button>
        </Tooltip>
      </Box>
      <Card variant={"soft"} color={"primary"} sx={{ mt: "15px" }}>
        <CardContent>
          <Typography sx={{ mt: "5px", mb: "15px" }}>
            Using the Java WebClient library we've prepared an Example
            Implementation for you. Have a look:
          </Typography>
          <Button
            variant={"outlined"}
            onClick={() => {
              const openUrlInNewWindow = (url: string) => {
                window.open(url, "_blank");
              };
              openUrlInNewWindow(
                "https://javafiddle.leaningtech.com/#N4IgLglmA2CmIC4QGUAOAnCA7A5gAgCEB7IsQqAMXQDeBnMgWVltoEMdY8AjdIga1jo8yQQDcIAY04QAtqjgzYWMK0hEsIADQgArqgAmq2PsQgATAAYzAVgC0FgJy2AjADYAKs+sJrFhFYA6ZwAWZwAtLRAAMwg4WkQAbVBUVQALUwZWbACAK1ZRVkiJdTAlMFNZVCJ0MmgiGS5+AIAlWABHHQh0YwBBdBxaAGF1enQdCTBqgG4AHSxK6rJqnADaDGwcKPRWRQB3ar4ArlhWLFoAqNYJ6oBPANOsUlUIdQCANVZoHVhZ+blFvDLVbrXBbHawfboQ6pMBgVABAASsNQCJO+kEtF+CxqgP6wMwoO2ewOq1K3VIN1QsACInQ4ikWP+OKBawJmyJEJJu1gXAC3SukFE1KiOiwExeWACEmgEDKAQA6jzBjKyoyqsy8ayNmDiVCAtzefzxUKLqLxa9pbLlAqlSrlK01iNYABRAAeUlQaiwaoBRsm6Cl1WpqB0XBltFSggCDHURF+cwAArT6bBE60Ol1ev0hiMwGNrug5iGw5I8NLWCxyGAtkR6EwWOxYMnJJxgHM8B28AB6ABUPfbncHABESngostYGRJnhaJO8GBI2X1DEcDptl68BgiFSarLaHhsHgbkQ13hurQT+gpLQu6xUPJJM9XjcdtABx2e125u-N5gCqUx2wT48EVLhlStMgDXA1VvywQcEw+L5YAAChmEAABJgC4KAa3oAItxyWAJlsFQcAAXzQgBKH91n-ThkDzDZfyIQiJncdh4zgzsEM+b5UIwrCcN4PCCKIsBbFnCRujACiQGoriO1ooxhEY3BmNYsARCkydOMHJSAPoZ4JEArBgIYtlCB6ZBnQAfQAVWaAAZPAAF48DQmE4VoBAuy7bDq2EsBVlYHRbHVFRoACdFb1QCAu1EZwu0UBsOBvYtw1SNDdM7dLS1EIgIH0GclH0es2A4ZDzKYyZYokAA5cFNDwAB5LgNM3VgbjqVh9EovA2wUwcVIstdoFc4aNguaoZFUfiAFIbwWrsFrQpqCCs2yHMcprRLY9gmpqyQGsUSjsqG+d0Bufqf3OjsoLtIKqnoZD5Nut6hoCNcIGQ0bXve-6AkjHrBGQpE4VRYH0HOHo7PcBFmuaABJMIencRHmrqpq0LdIidH9dyQDwABqdSxPY-ASbQhA0OJ0mJi06S-v+t6jiIfQbkQviUi6ogeqZ5nzr5SdMFgIUXpugXOwCSZiH0WJmFoZ1lCgG5xcGyWpbDIgJD4F6pm7LtuDqHW8FFSAxvPKozk4ZCF14XZ9wgKI8EEXh0H5wcyLLVQJFSPBkNA6D7WYK3ZzdD0N1gV0+oGgXfLwAAFXgUhwZSo4jiU8F2KA-dnOlBBd9A3bwdEVFiWgJfOu2iF2PAsAhPBmjN2QXXdWBPQlVD1Y1gmKCyOAiunWcsCK5Lys4adDuMgByGmSan47OEpkBp4QAnicrnvzqjgIODAZpWF2BjVB0HN0Re2mabnl3XV3ycHVD2BZZuHpaCq3AXs0TeBaj7-O1OzeXsJA+z9shcO7dI7R2ut3KuqR7Z1wbk3ZWihwEd3UPxOy9dXRUgmMYQuxddipHlsVEeTEx6NnnEQShtU8Cz0JvPbcR1wSXxXqtG+ACYF4AooNbh3CQBkQALpkSAA",
              );
            }}
          >
            Demo Implementation
          </Button>
        </CardContent>
      </Card>
      <ApprovalModal
        text={
          "Are you sure you want to refresh the Access Token of this Project? This will invalidate the current access token"
        }
        isOpen={isApprovalModalOpen}
        setOpen={setApprovalModalOpen}
        execute={handleSecretChange}
        submitText={"Refresh"}
        cancelText={"Back"}
        header={"Refresh Project Access Token"}
      />
    </GenericModal>
  );
};

export default ProjectSetupModal;
