package com.janne.bitfrost.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.HashCodeExclude;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private UserRole role;

    @ManyToMany
    @JoinTable(
        name = "user_project",
        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "uuid"),
        inverseJoinColumns = @JoinColumn(name = "project_id", referencedColumnName = "projectTag")
    )
    @JsonIgnore
    private Set<Project> assignedProjects = new HashSet<>();

    public enum UserRole {
        ADMIN,
        DEVELOPER
    }
}
