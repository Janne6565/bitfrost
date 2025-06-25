package com.janne.bitfrost.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccessRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;

    @Column
    private SubscriptionState state = SubscriptionState.REQUESTED;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_project_id", referencedColumnName = "projectTag")
    private Project requestedProject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", referencedColumnName = "id")
    private Topic topic;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requesting_project_id", referencedColumnName = "projectTag")
    private Project requestingProject;

    public enum SubscriptionState {
        REQUESTED,
        APPROVED
    }
}
