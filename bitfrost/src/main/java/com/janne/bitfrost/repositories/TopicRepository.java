package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {
}
