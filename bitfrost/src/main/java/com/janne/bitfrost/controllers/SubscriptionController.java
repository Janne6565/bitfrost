package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.Subscription;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.models.SubscriptionDto;
import com.janne.bitfrost.services.AuthService;
import com.janne.bitfrost.services.ProjectService;
import com.janne.bitfrost.services.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/project-requests")
public class SubscriptionController {

    private final AuthService authService;
    private final SubscriptionService subscriptionService;
    private final ProjectService projectService;

    @GetMapping("/{requestingProjectTag}")
    public ResponseEntity<Set<SubscriptionDto>> getAccessRequests(@PathVariable String requestingProjectTag) {
        authService.assertUserHasProjectAccess(requestingProjectTag);
        return ResponseEntity.ok(projectService.getProjectByTag(
            requestingProjectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found")
        ).getSubscriptions().stream().map(SubscriptionDto::from).collect(Collectors.toSet()));
    }

    @GetMapping("/requesting/{projectTag}")
    public ResponseEntity<Set<SubscriptionDto>> getAccessRequestsOnProject(@PathVariable String projectTag) {
        return ResponseEntity.ok(projectService.getProjectByTag(
                    projectTag
                ).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"))
                .getTopics().stream()
                .map(Topic::getSubscriptions)
                .flatMap(Collection::stream)
                .map(Subscription::toDto)
                .collect(Collectors.toSet())
        );
    }

    @PostMapping("/{requestingProjectTag}/request/{requestedProjectTag}/{label}")
    public ResponseEntity<SubscriptionDto> requestProjectSubscription(@PathVariable String requestingProjectTag, @PathVariable String requestedProjectTag, @PathVariable String label, @RequestBody String callbackUrl) {
        authService.assertUserHasProjectAccess(requestingProjectTag);
        return ResponseEntity.ok(subscriptionService.requestAccessToProject(requestingProjectTag, requestedProjectTag, label, callbackUrl).toDto());
    }

    @PostMapping("/approve/{accessRequestId}")
    public ResponseEntity<SubscriptionDto> approveProjectSubscription(@PathVariable String accessRequestId) {
        Subscription subscription = subscriptionService.getAccessRequest(accessRequestId);
        authService.assertUserHasProjectAccess(subscription.getRequestedProject().getProjectTag());
        subscriptionService.approveAccessRequest(accessRequestId);
        return ResponseEntity.ok(subscriptionService.getAccessRequest(accessRequestId).toDto());
    }

    @DeleteMapping("/{accessRequestId}")
    public ResponseEntity<Void> revokeAccessRequest(@PathVariable String accessRequestId) {
        Subscription subscription = subscriptionService.getAccessRequest(accessRequestId);
        authService.assertUserHasProjectAccess(List.of(subscription.getRequestedProject().getProjectTag(), subscription.getRequestingProject().getProjectTag()));
        subscriptionService.revokeAccessRequest(accessRequestId);
        return ResponseEntity.ok().build();
    }
}
