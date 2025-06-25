package com.janne.bitfrost.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    public String projectTag;
    @Column
    public String description;
    @OneToMany(cascade = CascadeType.ALL)
    public List<Topic> topics;
}
