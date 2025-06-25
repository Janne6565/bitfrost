package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, String> {
}
