package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.Subscription;
import com.janne.bitfrost.entities.Topic;
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
@RequestMapping("/project-requests")
public class SubscriptionController {

    private final AuthService authService;
    private final SubscriptionService subscriptionService;
    private final ProjectService projectService;

    @GetMapping("/{requestingProjectTag}")
    public ResponseEntity<Set<Subscription>> getAccessRequests(@PathVariable String requestingProjectTag) {
        return ResponseEntity.ok(projectService.getProjectByTag(
            requestingProjectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found")
        ).getSubscriptions());
    }

    @GetMapping("/requesting/{projectTag}")
    public ResponseEntity<Set<Subscription>> getAccessRequestsOnProject(@PathVariable String projectTag) {
        return ResponseEntity.ok(projectService.getProjectByTag(
                projectTag
            ).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found")).getTopics().stream().map(Topic::getSubscriptions).flatMap(Collection::stream).collect(Collectors.toSet())
        );
    }

    @PostMapping("/{requestingProjectTag}/request/{requestedProjectTag}/{label}")
    public ResponseEntity<Subscription> requestProjectSubscription(@PathVariable String requestingProjectTag, @PathVariable String requestedProjectTag, @PathVariable String label, @RequestBody String callbackUrl) {
        authService.assertUserHasProjectAccess(requestingProjectTag);
        return ResponseEntity.ok(subscriptionService.requestAccessToProject(requestingProjectTag, requestedProjectTag, label, callbackUrl));
    }

    @PostMapping("/approve/{accessRequestId}")
    public ResponseEntity<Void> approveProjectSubscription(@PathVariable String accessRequestId) {
        Subscription subscription = subscriptionService.getAccessRequest(accessRequestId);
        authService.assertUserHasProjectAccess(subscription.getRequestedProject().getProjectTag());
        subscriptionService.approveAccessRequest(accessRequestId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{accessRequestId}")
    public ResponseEntity<Void> revokeAccessRequest(@PathVariable String accessRequestId) {
        Subscription subscription = subscriptionService.getAccessRequest(accessRequestId);
        authService.assertUserHasProjectAccess(List.of(subscription.getRequestedProject().getProjectTag(), subscription.getRequestingProject().getProjectTag()).toArray(new String[0]));
        subscriptionService.revokeAccessRequest(accessRequestId);
        return ResponseEntity.ok().build();
    }
}
