package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, String> {

    @Query("SELECT m FROM Message m WHERE m.project.projectTag = :projectTag AND m.date >= :thresholdDate")
    List<Message> findAllByProjectId(@Param("projectTag") String projectTag,
                                     @Param("thresholdDate") LocalDateTime thresholdDate);

    @Query("SELECT m FROM Message m WHERE m.project.projectTag = :projectTag AND m.topic.label = :topicLabel AND m.date >= :thresholdDate")
    List<Message> findAllByProjectIdAndTopicLabel(@Param("projectTag") String projectTag,
                                                  @Param("topicLabel") String topicLabel,
                                                  @Param("thresholdDate") LocalDateTime thresholdDate);
}