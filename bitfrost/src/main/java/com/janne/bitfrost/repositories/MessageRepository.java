package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, String> {
    @Query("SELECT m FROM Message m WHERE m.project.projectTag = ?1")
    List<Message> findAllByProjectId(String projectTag);

    @Query("SELECT m FROM Message m WHERE m.project.projectTag = ?1 AND m.topic.label = ?2")
    List<Message> findAllByProjectIdAndTopicLabel(String projectTag, String topicLabel);
}
