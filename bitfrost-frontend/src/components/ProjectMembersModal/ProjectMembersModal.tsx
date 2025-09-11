import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import type { Project, User } from "@/@types/backendTypes.ts";
import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/useApi/useApi.ts";
import AddUserInputField from "./AddUserInputField";
import { FormLabel } from "@mui/joy";
import MemberDatagrid from "@/components/ProjectMembersModal/MemberDatagrid.tsx";

const ProjectMembersModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
}) => {
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const { fetchProjectMembers, revokeUserAccessRights, addUserAccessRights } =
    useApi();
  const revokeUserAccess = useCallback(
    async (user: User) => {
      const res = await revokeUserAccessRights(
        props.project.projectTag,
        user.uuid,
      );
      if (res) {
        setProjectMembers(
          projectMembers.filter((member) => member.uuid != user.uuid),
        );
      }
    },
    [projectMembers, props.project.projectTag, revokeUserAccessRights],
  );

  const updateProjectMembers = useCallback(async () => {
    fetchProjectMembers(props.project.projectTag).then((result) =>
      setProjectMembers(result ?? []),
    );
  }, [fetchProjectMembers, props.project.projectTag]);

  const addProjectMember = useCallback(
    async (email: string) => {
      const res = await addUserAccessRights(props.project.projectTag, email);
      if (res == "") {
        updateProjectMembers();
        return res;
      }
      return res;
    },
    [addUserAccessRights, props.project.projectTag, updateProjectMembers],
  );

  useEffect(() => {
    updateProjectMembers();
  }, [updateProjectMembers]);

  return (
    <GenericModal
      header={"Project Members"}
      open={props.isOpen}
      setOpen={props.setOpen}
    >
      <AddUserInputField callback={addProjectMember} />
      <FormLabel>Total Users</FormLabel>
      <MemberDatagrid
        user={projectMembers}
        removeUserCallback={revokeUserAccess}
      />
    </GenericModal>
  );
};

export default ProjectMembersModal;
