package com.janne.bitfrost.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.janne.bitfrost.models.ProjectDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
@ToString
public class Project {
    @Id
    private String projectTag;
    @Column
    private String description;
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Topic> topics;
    @JsonIgnore
    @ToString.Exclude
    @ManyToMany(mappedBy = "assignedProjects")
    private Set<User> assignedUsers = new HashSet<>();
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "requestingProject", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Subscription> subscriptions = new HashSet<>();

    public ProjectDto toDto() {
        return ProjectDto.from(this);
    }
}
