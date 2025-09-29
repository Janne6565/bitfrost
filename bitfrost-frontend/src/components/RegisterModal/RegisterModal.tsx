import useApi from "@/hooks/useApi/useApi.ts";
import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useCallback, useState } from "react";
import Stack from "@mui/joy/Stack";
import { enqueueSnackbar } from "notistack";

const RegisterModal = (props: {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
}) => {
  const { register } = useApi();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const registerCallback = useCallback(() => {
    register(email, password, name).then(() => {
      props.setOpen(false);
      setEmail("");
      setName("");
      setPassword("");
      enqueueSnackbar("Registered successfully, you can now log in", {
        variant: "success",
      });
    });
  }, [email, name, password, props, register]);

  return (
    <GenericModal
      header={"Register yourself"}
      open={props.open}
      setOpen={props.setOpen}
    >
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder={"John"}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type={"email"}
            placeholder={"johnpaul@example.org"}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder={"Password"}
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button onClick={registerCallback}>Register</Button>
      </Stack>
    </GenericModal>
  );
};

export default RegisterModal;
