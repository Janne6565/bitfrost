package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Subscription;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.repositories.JobRepository;
import com.janne.bitfrost.repositories.ProjectRepository;
import com.janne.bitfrost.repositories.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private static final Pattern URL_REGEX = Pattern.compile(
        "^https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)*(?::\\d+)?[\\/\\w\\-\\._~:\\/?#\\[\\]@!$&'()*+,;=]*$");

    private final ProjectRepository projectRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final JobRepository jobRepository;

    public Subscription requestAccessToProject(String requestingProjectTag, String requestedProjectTag, String label,
                                               String callbackUrl) {
        Project requestingProject = projectRepository.getReferenceById(requestingProjectTag);
        Project requestedProject = projectRepository.getReferenceById(requestedProjectTag);
        Topic topic = requestedProject.getTopics().stream().filter(t -> t.getLabel().equals(label)).findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
        if (topic.getSubscriptions().stream().anyMatch(sub -> sub.getRequestingProject().equals(requestingProject))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Subscription already exists");
        }
        if (callbackUrl != null && !callbackUrl.isEmpty()) {
            Matcher matcher = URL_REGEX.matcher(callbackUrl);
            if (!matcher.matches()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid callback URL format");
            }
        }
        Subscription subscription = Subscription.builder()
            .requestedProject(requestedProject)
            .requestingProject(requestingProject)
            .topic(topic)
            .state(Subscription.SubscriptionState.REQUESTED)
            .callbackUrl(callbackUrl)
            .build();
        Subscription storedSubscription = subscriptionRepository.save(subscription);
        requestingProject.getSubscriptions().add(storedSubscription);
        topic.getSubscriptions().add(storedSubscription);
        projectRepository.save(requestingProject);
        projectRepository.save(requestedProject);
        return storedSubscription;
    }

    public void approveAccessRequest(String requestId) {
        Subscription subscription = subscriptionRepository.findById(requestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Access request not found"));
        subscription.setState(Subscription.SubscriptionState.APPROVED);
        subscriptionRepository.save(subscription);
    }

    public Subscription getAccessRequest(String accessRequestId) {
        return subscriptionRepository.findById(accessRequestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Access request not found"));
    }

    public void revokeAccessRequest(String accessRequestId) {
        Subscription subscription = getAccessRequest(accessRequestId);
        Project requestingProject = subscription.getRequestedProject();
        Project requestedProject = subscription.getRequestingProject();
        Topic requestedTopic = subscription.getTopic();
        requestedTopic.getSubscriptions().remove(subscription);
        requestingProject.getSubscriptions().remove(subscription);
        jobRepository.removeAllBySubscription(subscription);
        projectRepository.save(requestingProject);
        projectRepository.save(requestedProject);
        subscriptionRepository.delete(subscription);
    }

    public Set<Subscription> getAllSubscriptions() {
        return new HashSet<>(subscriptionRepository.findAll());
    }

    public Set<Subscription> getSubscriptionsRegardingProject(Project project) {
        return new HashSet<>(subscriptionRepository.findAllByRequestingProjectOrRequestedProject(project, project));
    }
}
