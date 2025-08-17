package com.janne.bitfrost.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;
    @Column
    private String label;
    @Column
    private String description;
    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    private Project project;
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Subscription> subscriptions = new HashSet<>();
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Message> messages = new HashSet<>();

}
