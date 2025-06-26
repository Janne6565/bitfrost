package com.janne.bitfrost.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.http.HttpStatusCode;

import java.time.Instant;
import java.util.Map;

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

    @Column
    private String message;

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
