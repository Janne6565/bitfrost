package com.janne.bitfrost.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;

    @Column
    private SubscriptionState state = SubscriptionState.REQUESTED;

    @Column
    private String callbackUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requestedProject", referencedColumnName = "projectTag")
    private Project requestedProject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic", referencedColumnName = "uuid")
    private Topic topic;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requestingProject", referencedColumnName = "projectTag")
    private Project requestingProject;

    public enum SubscriptionState {
        REQUESTED,
        APPROVED
    }
}
