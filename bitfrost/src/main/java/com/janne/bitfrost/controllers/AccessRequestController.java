package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.AccessRequest;
import com.janne.bitfrost.services.AccessRequestService;
import com.janne.bitfrost.services.AuthService;
import com.janne.bitfrost.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/project-requests")
public class AccessRequestController {

    private final AuthService authService;
    private final AccessRequestService accessRequestService;
    private final ProjectService projectService;

    @GetMapping("/{requestingProjectTag}")
    public ResponseEntity<Set<AccessRequest>> getAccessRequests(@PathVariable String requestingProjectTag) {
        return ResponseEntity.ok(projectService.getProjectByTag(
            requestingProjectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found")
        ).getAccessRequests());
    }

    @PostMapping("/{requestingProjectTag}/request/{requestedProjectTag}/{label}")
    public ResponseEntity<Void> requestProjectSubscription(@PathVariable String requestingProjectTag, @PathVariable String requestedProjectTag, @PathVariable String label) {
        authService.assertUserHasProjectAccess(requestedProjectTag);
        accessRequestService.requestAccessToProject(requestingProjectTag, requestedProjectTag, label);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/approve/{accessRequestId}")
    public ResponseEntity<Void> approveProjectSubscription(@PathVariable String accessRequestId) {
        AccessRequest accessRequest = accessRequestService.getAccessRequest(accessRequestId);
        authService.assertUserHasProjectAccess(accessRequest.getRequestedProject().getProjectTag());
        accessRequestService.approveAccessRequest(accessRequestId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{accessRequestId}")
    public ResponseEntity<Void> revokeAccessRequest(@PathVariable String accessRequestId) {
        AccessRequest accessRequest = accessRequestService.getAccessRequest(accessRequestId);
        authService.assertUserHasProjectAccess(List.of(accessRequest.getRequestedProject().getProjectTag(), accessRequest.getRequestingProject().getProjectTag()).toArray(new String[0]));
        accessRequestService.revokeAccessRequest(accessRequestId);
        return ResponseEntity.ok().build();
    }
}
