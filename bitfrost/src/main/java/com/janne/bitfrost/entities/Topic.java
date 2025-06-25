package com.janne.bitfrost.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column
    private String label;
    @Column
    private String description;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL)
    private Set<AccessRequest> accessRequests = new HashSet<>();
}
