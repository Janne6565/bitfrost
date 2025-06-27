package com.janne.bitfrost.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;

    @ManyToOne(fetch = FetchType.EAGER)
    private Message message;

    @ManyToOne(fetch = FetchType.EAGER)
    private Topic topic;

    @ManyToOne(fetch = FetchType.EAGER)
    private Subscription subscription;

    @Column
    private long earliestExecution;

    @Column
    private long numberOfRetries;

    @Column
    private JobStatus status;

    @Column
    @Embedded
    private HttpExchangeLog httpExchangeLog;

    public enum JobStatus {
        WAITING,
        DONE,
        FAILED
    }
}
