package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.HttpExchangeLog;
import com.janne.bitfrost.entities.Job;
import com.janne.bitfrost.entities.Message;
import com.janne.bitfrost.entities.Subscription;
import com.janne.bitfrost.repositories.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobExecutorService jobExecutorService;
    private final TimeIntervalService timeIntervalService;
    private final JobExecutionSuccessAnalysisService jobExecutionSuccessAnalysisService;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Scheduled(fixedDelay = 500, timeUnit = TimeUnit.MILLISECONDS)
    public void executeJobs() {
        jobRepository.findAllByEarliestExecutionBeforeAndStatus(System.currentTimeMillis(), Job.JobStatus.WAITING).forEach(job -> {
            Mono<HttpExchangeLog> jobExecution = jobExecutorService.executeJob(job);
            HttpExchangeLog jobExecutionResult = jobExecution.block();
            job.setHttpExchangeLog(jobExecutionResult);
            if (jobExecutionSuccessAnalysisService.checkJobSuccessful(jobExecutionResult)) {
                job.setStatus(Job.JobStatus.DONE);
            } else {
                job.setStatus(Job.JobStatus.FAILED);
                jobRepository.save(Job.builder()
                    .message(job.getMessage())
                    .numberOfRetries(job.getNumberOfRetries() + 1)
                    .topic(job.getTopic())
                    .status(Job.JobStatus.WAITING)
                    .subscription(job.getSubscription())
                    .earliestExecution(System.currentTimeMillis() + timeIntervalService.getTimeInterval(job.getNumberOfRetries() + 1))
                    .build());
            }
            jobRepository.save(job);
        });
    }

    public Set<Job> getJobsFromMessage(Message message) {
        return jobRepository.findAllByMessage(message);
    }

    public void scheduleMessage(Message message) {
        Set<Subscription> subscriptions = message.getTopic().getSubscriptions();
        subscriptions.forEach(subscription -> {
            scheduleJob(subscription, message);
        });
    }

    private void scheduleJob(Subscription subscription, Message message) {
        Job job = Job.builder()
            .message(message)
            .topic(subscription.getTopic())
            .numberOfRetries(0)
            .subscription(subscription)
            .status(Job.JobStatus.WAITING)
            .earliestExecution(System.currentTimeMillis())
            .build();

        log.info("Scheduling job {}", job);

        jobRepository.save(job);
    }
}
