import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "@/stores/rootReducer.ts"; // adjust import path
import useApi from "@/hooks/useApi/useApi";
import {
    setSubscription,
    removeSubscription,
    setSubscriptions,
} from "@/stores/slices/subscriptionSlice";
import type {Subscription } from "@/@types/backendTypes.ts";
import {SubscriptionState } from "@/@types/backendTypes.ts";

export default function useSubscriptionsList() {
    const dispatch = useDispatch();
    const { fetchSubscriptions, approveSubscription, deleteSubscription } = useApi();

    const subs: Subscription[] = useTypedSelector((state) =>
        Object.values(state.subscriptionSlice.subscriptions),
    );

    const reload = useCallback(async () => {
        const result = await fetchSubscriptions();
        if (result) {
            dispatch(setSubscriptions(result));
        }
    }, [dispatch, fetchSubscriptions]);

    const approve = useCallback(
        async (uuid: string) => {
            const ok = await approveSubscription(uuid);
            if (ok) {
                const sub = subs.find((s) => s.uuid === uuid);
                if (sub) {
                    dispatch(
                        setSubscription({ ...sub, state: SubscriptionState.APPROVED }),
                    );
                }
            }
        },
        [approveSubscription, dispatch, subs],
    );

    const remove = useCallback(
        async (uuid: string) => {
            const ok = await deleteSubscription(uuid);
            if (ok) {
                dispatch(removeSubscription(uuid));
            }
        },
        [deleteSubscription, dispatch],
    );

    return { subs, reload, approve, remove };
}
