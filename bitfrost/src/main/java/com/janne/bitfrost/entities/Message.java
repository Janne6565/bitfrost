package com.janne.bitfrost.entities;

import com.janne.bitfrost.models.MessageDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;

    @ManyToOne(fetch = FetchType.EAGER)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    private Topic topic;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime date;

    public MessageDto toDto() {
        return MessageDto.from(this);
    }
}
