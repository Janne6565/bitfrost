package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.Message;
import com.janne.bitfrost.models.JobDto;
import com.janne.bitfrost.services.JobService;
import com.janne.bitfrost.services.MessagePublishingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;
    private final MessagePublishingService messagePublishingService;

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs() {
        List<Message> messages = messagePublishingService.getAllMessages();
        return ResponseEntity.ok(messages.stream().map(jobService::getJobsFromMessage).flatMap(Collection::stream).map(JobDto::from).collect(Collectors.toList()));
    }
}
