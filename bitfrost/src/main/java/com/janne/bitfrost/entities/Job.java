package com.janne.bitfrost.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Long> retryTimestamps;

    @Column
    private long earliestExecution;

    @Column
    private long retryCount;

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
