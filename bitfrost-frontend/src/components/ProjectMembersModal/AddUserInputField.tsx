import { SendOutlined } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useCallback, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";

const AddUserInputField = (props: {
  callback: (email: string) => Promise<string>;
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const emailValid = useMemo(() => {
    // check if email is valid using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  const callback = useCallback(async () => {
    setLoading(true);
    if (emailValid) {
      const errorResponse = await props.callback(email);
      if (!errorResponse) {
        enqueueSnackbar("User added successfully", { variant: "success" });
        setEmail("");
      } else {
        enqueueSnackbar(
          <Box>
            <Typography level={"body-md"} sx={{ color: "white" }}>
              Error while adding user
            </Typography>
            <Typography
              level={"body-sm"}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {errorResponse}
            </Typography>
          </Box>,
          { variant: "error" },
        );
      }
    } else {
      enqueueSnackbar("Invalid email address", { variant: "error" });
    }
    setLoading(false);
  }, [emailValid, props, email]);

  return (
    <FormControl>
      <FormLabel>Add User</FormLabel>
      <Input
        id="add-user-input"
        type={"email"}
        placeholder={"franz@example.org"}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key == "Enter" && emailValid) {
            callback();
          }
        }}
        value={email}
        endDecorator={
          <Tooltip
            title={
              !emailValid
                ? "Invalid email address"
                : "Add a user to this project"
            }
          >
            <IconButton
              color={"neutral"}
              disabled={!emailValid || loading}
              onClick={callback}
            >
              <SendOutlined />
            </IconButton>
          </Tooltip>
        }
      />
    </FormControl>
  );
};

export default AddUserInputField;
