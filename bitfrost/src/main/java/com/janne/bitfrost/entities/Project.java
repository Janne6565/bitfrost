package com.janne.bitfrost.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.HashCodeExclude;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Project {
    @Id
    private String projectTag;
    @Column
    private String description;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Topic> topics;
    @JsonIgnore
    @ManyToMany(mappedBy = "assignedProjects")
    private Set<User> assignedUsers = new HashSet<>();
}
