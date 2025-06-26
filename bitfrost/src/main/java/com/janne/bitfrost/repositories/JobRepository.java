package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Job;
import com.janne.bitfrost.entities.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, String> {
    List<Job> findAllByEarliestExecutionBefore(long earliestExecutionBefore);

    List<Job> findAllByEarliestExecutionBeforeAndStatus(long earliestExecutionBefore, Job.JobStatus status);

    void removeAllBySubscription(Subscription subscription);
}
