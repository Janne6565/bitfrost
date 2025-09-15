import useAxiosInstance from "@/hooks/useAxiosInstance/useAxiosInstance.tsx";
import config from "../../../app.config.json";
import type {
  Job,
  Message,
  Project,
  Subscription,
  Topic,
  User,
} from "@/@types/backendTypes.ts";
import { useCallback } from "react";

const useApi = () => {
  const axiosInstance = useAxiosInstance(config.backendBaseUrl);
  const errorHandle = async <T>(
    callback: () => Promise<T>,
  ): Promise<T | undefined> => {
    try {
      return await callback();
    } catch (error) {
      console.warn("Error while API call:", error);
    }
  };

  const login = useCallback(
    async (email: string, password: string) =>
      errorHandle(async () => {
        return (
          (
            await axiosInstance.get(
              "/auth/login?email=" + email + "&password=" + password,
              { withCredentials: true },
            )
          ).status == 200
        );
      }),
    [axiosInstance],
  );

  const register = useCallback(
    async (email: string, password: string, name: string) =>
      errorHandle(async () => {
        return (
          await axiosInstance.post("/auth/user", { email, password, name })
        ).data as User;
      }),
    [axiosInstance],
  );

  const fetchToken = useCallback(
    async () =>
      errorHandle(async () => {
        return (
          await axiosInstance.get("/auth/token", { withCredentials: true })
        ).data as string;
      }),
    [axiosInstance],
  );

  const fetchProjects = useCallback(
    async () =>
      errorHandle(async () => {
        return (await axiosInstance.get("/projects")).data as Project[];
      }),
    [axiosInstance],
  );

  const fetchOwnedProjects = useCallback(
    async () =>
      errorHandle(async () => {
        return (await axiosInstance.get("/projects/owned")).data as Project[];
      }),
    [axiosInstance],
  );

  const fetchMessages = useCallback(
    async () =>
      errorHandle(async () => {
        return (await axiosInstance.get("/messages")).data as Message[];
      }),
    [axiosInstance],
  );

  const fetchTopics = useCallback(
    async () =>
      errorHandle(async () => {
        return (await axiosInstance.get("/projects/topics")).data as Topic[];
      }),
    [axiosInstance],
  );

  const fetchJobs = useCallback(
    async () =>
      errorHandle(async () => {
        return (await axiosInstance.get("/jobs")).data as Job[];
      }),
    [axiosInstance],
  );

  const fetchSubscriptions = useCallback(
    async () =>
      errorHandle(async () => {
        return (await axiosInstance.get("/project-requests"))
          .data as Subscription[];
      }),
    [axiosInstance],
  );

  const fetchProjectMembers = useCallback(
    async (projectTag: string) =>
      errorHandle(async () => {
        return (await axiosInstance.get("/users/assigned-to/" + projectTag))
          .data as User[];
      }),
    [axiosInstance],
  );

  const revokeUserAccessRights = useCallback(
    async (projectTag: string, userId: string) =>
      errorHandle(async () => {
        return (
          (
            await axiosInstance.delete(
              "/projects/revoke/" + projectTag + "?userId=" + userId,
            )
          ).status == 200
        );
      }),
    [axiosInstance],
  );

  const addUserAccessRights = useCallback(
    async (projectTag: string, userEmail: string) =>
      errorHandle(async () => {
        try {
          const response = await axiosInstance.post(
            "/projects/allow/" + projectTag + "?userEmail=" + userEmail,
          );
          if (response.status == 200) {
            return "";
          }
        } catch (error) {
          const errorResponse = error as { response?: { data: string } };
          return errorResponse.response?.data;
        }
      }),
    [axiosInstance],
  );

    const requestProjectSubscription = useCallback(
    async (requestingProjectTag: string, requestedProjectTag: string ,label: string, callbackUrl: string) =>
      errorHandle(async () => {
        try {
          const response = await axiosInstance.post(
            "project-requests/" + requestingProjectTag + "/request/" + requestedProjectTag + "/" + label, {callbackUrl}
          );
          if (response.status == 200) {
            return "";
          }
        } catch (error) {
          const errorResponse = error as { response?: { data: string } };
          return errorResponse.response?.data;
        }
      }),
    [axiosInstance],
  );

  return {
    register,
    login,
    fetchToken,
    fetchJobs,
    fetchProjects,
    fetchTopics,
    fetchOwnedProjects,
    fetchSubscriptions,
    fetchMessages,
    fetchProjectMembers,
    revokeUserAccessRights,
    addUserAccessRights,
    requestProjectSubscription
  };
};

export default useApi;
