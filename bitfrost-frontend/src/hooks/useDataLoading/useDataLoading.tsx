import { useCallback } from "react";
import useApi from "@/hooks/useApi/useApi.ts";
import { useDispatch } from "react-redux";
import { setOwnedProjects } from "@/stores/slices/ownedProjectSlice.tsx";
import { setProjects } from "@/stores/slices/projectSlice.ts";
import { setMessages } from "@/stores/slices/messageSlice.ts";
import { setTopics } from "@/stores/slices/topicSlice.ts";
import { setJobs } from "@/stores/slices/jobSlice.ts";
import { setSubscriptions } from "@/stores/slices/subscriptionSlice.ts";

const useDataLoading = () => {
  const dispatch = useDispatch();
  const {
    fetchProjects,
    fetchOwnedProjects,
    fetchMessages,
    fetchJobs,
    fetchTopics,
    fetchSubscriptions,
  } = useApi();

  const updateProjects = useCallback(async () => {
    await fetchProjects().then((projects) => {
      dispatch(setProjects(projects ?? []));
    });
  }, [dispatch, fetchProjects]);

  const initialLoading = useCallback(async () => {
    const projects = await fetchProjects();
    const ownedProjects = await fetchOwnedProjects();
    const messages = await fetchMessages();
    const topics = await fetchTopics();
    const jobs = await fetchJobs();
    const subscriptions = await fetchSubscriptions();
    dispatch(setProjects(projects ?? []));
    dispatch(setOwnedProjects(ownedProjects ?? []));
    dispatch(setMessages(messages ?? []));
    dispatch(setTopics(topics ?? []));
    dispatch(setJobs(jobs ?? []));
    dispatch(setSubscriptions(subscriptions ?? []));
    setTimeout(() => {
      initialLoading();
    }, 2000);
  }, [
    fetchProjects,
    fetchOwnedProjects,
    fetchMessages,
    fetchTopics,
    fetchJobs,
    fetchSubscriptions,
    dispatch,
  ]);

  return { initialLoading, updateProjects };
};

export default useDataLoading;
