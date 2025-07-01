package com.janne.bitfrost.models;

import com.janne.bitfrost.entities.HttpExchangeLog;
import com.janne.bitfrost.entities.Job;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobDto {
    private String uuid;
    private String messageId;
    private String topicId;
    private String subscriptionId;
    private Job.JobStatus status;
    private long earliestExecution;
    private long retryCount;
    private HttpExchangeLog httpExchangeLog;

    public static JobDto from(Job job) {
        return JobDto.builder()
            .uuid(job.getUuid())
            .messageId(job.getMessage().getUuid())
            .status(job.getStatus())
            .topicId(job.getTopic().getUuid())
            .subscriptionId(job.getSubscription().getUuid())
            .earliestExecution(job.getEarliestExecution())
            .retryCount(job.getRetryCount())
            .httpExchangeLog(job.getHttpExchangeLog())
            .build();
    }
}
