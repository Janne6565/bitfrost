import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/useApi/useApi";
import useAxiosInstance from "@/hooks/useAxiosInstance/useAxiosInstance";
import config from "../../../app.config.json";
import type { Subscription } from "@/@types/backendTypes";
import { SubscriptionState } from "@/@types/backendTypes";

export default function useSubscriptionsList() {
    const { fetchSubscriptions, fetchToken } = useApi();
    const axios = useAxiosInstance(config.backendBaseUrl);

    const [subs, setSubs] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const token = await fetchToken();
            if (token) localStorage.setItem("idToken", token);
            const result = await fetchSubscriptions();
            const normalized = Array.isArray(result)
                ? result
                : result && typeof result === "object"
                    ? Object.values(result as Record<string, Subscription>)
                    : [];
            setSubs(normalized);
        } catch (e) {
            console.error("Failed to load subscriptions:", e);
            setSubs([]);
        } finally {
            setLoading(false);
        }
    }, [fetchSubscriptions, fetchToken]);

    useEffect(() => {
        load();
    }, [load]);

    const approve = useCallback(
        async (uuid: string) => {
            const res = await axios.post(`/project-requests/approve/${uuid}`);
            if (res.status === 200) {
                setSubs((prev) =>
                    prev.map((s) => (s.uuid === uuid ? { ...s, state: SubscriptionState.APPROVED } : s)),
                );
            }
        },
        [axios],
    );

    const remove = useCallback(
        async (uuid: string) => {
            const res = await axios.delete(`/project-requests/${uuid}`);
            if (res.status === 200) {
                setSubs((prev) => prev.filter((s) => s.uuid !== uuid));
            }
        },
        [axios],
    );

    return { subs, loading, reload: load, approve, remove };
}
