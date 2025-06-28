package com.janne.bitfrost.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.time.Instant;
import java.util.Map;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HttpExchangeLog {
    @Column
    private String uri;
    @Column
    private String method;

    @Column
    private String requestHeadersJson;

    @Column
    private String requestBody;

    @Column
    private int statusCode;

    @Column
    private String responseHeadersJson;

    @Column
    private String responseBody;

    @Column
    private Instant timestamp;

    @JsonIgnore
    public void setRequestHeaders(Map<String, String> headers) {
        this.requestHeadersJson = toJson(headers);
    }

    @JsonIgnore
    public void setResponseHeaders(Map<String, String> headers) {
        this.responseHeadersJson = toJson(headers);
    }

    private String toJson(Map<String, String> map) {
        try {
            return new ObjectMapper().writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize headers", e);
        }
    }

    public Map<String, String> getRequestHeaders() {
        return fromJson(requestHeadersJson);
    }

    public Map<String, String> getResponseHeaders() {
        return fromJson(responseHeadersJson);
    }

    private Map<String, String> fromJson(String json) {
        try {
            return new ObjectMapper().readValue(json, new TypeReference<>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize headers", e);
        }
    }
}