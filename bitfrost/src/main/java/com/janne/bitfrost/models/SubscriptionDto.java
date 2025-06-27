package com.janne.bitfrost.models;

import com.janne.bitfrost.entities.Subscription;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubscriptionDto {
    private String uuid;
    private Subscription.SubscriptionState subscriptionState;
    private String callbackUrl;
    private String requestingProjectTag;
    private String requestedProjectTag;

    public static SubscriptionDto from(Subscription subscription) {
        return SubscriptionDto.builder()
            .uuid(subscription.getUuid())
            .subscriptionState(subscription.getState())
            .callbackUrl(subscription.getCallbackUrl())
            .requestingProjectTag(subscription.getRequestingProject().getProjectTag())
            .requestedProjectTag(subscription.getRequestedProject().getProjectTag())
            .build();
    }
}
