package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, String> {

    Optional<Project> getProjectByProjectTag(String projectTag);
}
