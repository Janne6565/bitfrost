package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Job;
import com.janne.bitfrost.entities.Message;
import com.janne.bitfrost.entities.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface JobRepository extends JpaRepository<Job, String> {

    @Query("SELECT j FROM Job j WHERE j.earliestExecution < :executionTime AND j.earliestExecution >= :thresholdTime")
    List<Job> findRecentJobsBefore(@Param("executionTime") long executionTime,
                                   @Param("thresholdTime") long thresholdTime);

    // With status filter
    @Query("SELECT j FROM Job j WHERE j.earliestExecution < :executionTime AND j.earliestExecution >= :thresholdTime AND j.status = :status")
    List<Job> findRecentJobsBeforeWithStatus(@Param("executionTime") long executionTime,
                                             @Param("thresholdTime") long thresholdTime,
                                             @Param("status") Job.JobStatus status);

    void removeAllBySubscription(Subscription subscription);

    Set<Job> findAllByMessage(Message message);
}
