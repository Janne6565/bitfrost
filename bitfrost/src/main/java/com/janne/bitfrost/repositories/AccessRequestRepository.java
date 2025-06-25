package com.janne.bitfrost.repositories;

import com.janne.bitfrost.entities.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, String> {
}
