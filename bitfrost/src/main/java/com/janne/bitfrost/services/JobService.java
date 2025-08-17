package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.HttpExchangeLog;
import com.janne.bitfrost.entities.Job;
import com.janne.bitfrost.entities.Message;
import com.janne.bitfrost.entities.Subscription;
import com.janne.bitfrost.repositories.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobExecutorService jobExecutorService;
    private final TimeIntervalService timeIntervalService;
    private final JobExecutionSuccessAnalysisService jobExecutionSuccessAnalysisService;
    @Value("${app.past-date-range}")
    private int pastDateRange;

    @Scheduled(fixedDelay = 500, timeUnit = TimeUnit.MILLISECONDS)
    public void executeJobs() {
        jobRepository.findRecentJobsBeforeWithStatus(System.currentTimeMillis(), System.currentTimeMillis() - (long) pastDateRange * 24 * 60 * 60 * 1000, Job.JobStatus.WAITING).forEach(job -> {
            Mono<HttpExchangeLog> jobExecution = jobExecutorService.executeJob(job);
            HttpExchangeLog jobExecutionResult = jobExecution.block();
            job.setHttpExchangeLog(jobExecutionResult);
            if (jobExecutionResult != null && jobExecutionSuccessAnalysisService.checkJobSuccessful(jobExecutionResult)) {
                job.setStatus(Job.JobStatus.DONE);
            } else {
                job.setStatus(Job.JobStatus.WAITING);
                job.getRetryTimestamps().add(System.currentTimeMillis());
                job.setEarliestExecution(System.currentTimeMillis() + timeIntervalService.getTimeInterval(job.getRetryCount() + 1));
                job.setRetryCount(job.getRetryCount() + 1);
            }
            jobRepository.save(job);
        });
    }

    public Set<Job> getJobsFromMessage(Message message) {
        return jobRepository.findAllByMessage(message);
    }

    public void scheduleMessage(Message message) {
        Set<Subscription> subscriptions = message.getTopic().getSubscriptions().stream().filter(subscription -> subscription.getState().equals(Subscription.SubscriptionState.APPROVED)).collect(Collectors.toSet());
        subscriptions.forEach(subscription -> {
            scheduleJob(subscription, message);
        });
    }

    private void scheduleJob(Subscription subscription, Message message) {
        Job job = Job.builder()
            .message(message)
            .retryTimestamps(new ArrayList<>())
            .topic(subscription.getTopic())
            .retryCount(0)
            .subscription(subscription)
            .status(Job.JobStatus.WAITING)
            .earliestExecution(System.currentTimeMillis())
            .build();

        log.info("Scheduling job {}", job);

        jobRepository.save(job);
    }
}
