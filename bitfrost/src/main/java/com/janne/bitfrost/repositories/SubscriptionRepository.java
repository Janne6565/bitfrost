package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, String> {
    void deleteByRequestedProject(Project requestedProject);

    void deleteByRequestingProject(Project requestingProject);

    List<Subscription> findAllByRequestedProject(Project requestedProject);

    List<Subscription> findAllByRequestingProject(Project requestingProject);
}
