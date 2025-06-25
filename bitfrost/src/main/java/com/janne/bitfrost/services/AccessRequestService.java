package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.AccessRequest;
import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.repositories.AccessRequestRepository;
import com.janne.bitfrost.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AccessRequestService {

    private final ProjectRepository projectRepository;
    private final AccessRequestRepository accessRequestRepository;

    public void requestAccessToProject(String requestingProjectTag, String requestedProjectTag, String label) {
        Project requestingProject = projectRepository.getReferenceById(requestingProjectTag);
        Project requestedProject = projectRepository.getReferenceById(requestedProjectTag);
        Topic topic = requestedProject.getTopics().stream().filter(t -> t.getLabel().equals(label)).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
        AccessRequest accessRequest = AccessRequest.builder()
            .requestedProject(requestedProject)
            .requestingProject(requestingProject)
            .topic(topic)
            .state(AccessRequest.SubscriptionState.REQUESTED)
            .build();
        requestingProject.getAccessRequests().add(accessRequest);
        topic.getAccessRequests().add(accessRequest);
        projectRepository.save(requestingProject);
        projectRepository.save(requestedProject);
    }

    public void approveAccessRequest(String requestId) {
        AccessRequest accessRequest = accessRequestRepository.findById(requestId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Access request not found"));
        accessRequest.setState(AccessRequest.SubscriptionState.APPROVED);
        accessRequestRepository.save(accessRequest);
    }

    public AccessRequest getAccessRequest(String accessRequestId) {
        return accessRequestRepository.findById(accessRequestId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Access request not found"));
    }

    public void revokeAccessRequest(String accessRequestId) {
        AccessRequest accessRequest = getAccessRequest(accessRequestId);
        Project requestingProject = accessRequest.getRequestedProject();
        Project requestedProject = accessRequest.getRequestingProject();
        Topic requestedTopic = accessRequest.getTopic();
        requestedTopic.getAccessRequests().remove(accessRequest);
        requestingProject.getAccessRequests().remove(accessRequest);
        projectRepository.save(requestingProject);
        projectRepository.save(requestedProject);
        accessRequestRepository.delete(accessRequest);
    }
}
