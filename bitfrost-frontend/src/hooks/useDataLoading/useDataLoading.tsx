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

  const loadProjects = useCallback(async () => {
    await fetchProjects().then((projects) => {
      dispatch(setProjects(projects ?? []));
    });
  }, [dispatch, fetchProjects]);

  const loadTopics = useCallback(async () => {
    const topics = await fetchTopics();
    dispatch(setTopics(topics ?? []));
  }, [fetchTopics, dispatch]);

  const loadOwnedProjects = useCallback(async () => {
    const ownedProjects = await fetchOwnedProjects();
    dispatch(setOwnedProjects(ownedProjects ?? []));
  }, [fetchOwnedProjects, dispatch]);

  const loadSubscriptions = useCallback(async () => {
    const subscriptions = await fetchSubscriptions();
    dispatch(setSubscriptions(subscriptions ?? []));
  }, [fetchSubscriptions, dispatch]);

  const initialLoading = useCallback(async () => {
    const messages = await fetchMessages();
    const jobs = await fetchJobs();
    dispatch(setMessages(messages ?? []));
    dispatch(setJobs(jobs ?? []));
    await loadTopics();
    await loadProjects();
    await loadOwnedProjects();
    await loadSubscriptions();
  }, [
    loadProjects,
    fetchMessages,
    fetchJobs,
    fetchSubscriptions,
    dispatch,
    loadTopics,
    loadOwnedProjects,
    loadSubscriptions,
  ]);

  return {
    initialLoading,
    loadProjects,
    loadTopics,
    loadOwnedProjects,
    loadSubscriptions,
  };
};

export default useDataLoading;
