package com.janne.bitfrost.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Lob;
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
    private String uri;
    private String method;

    @Lob
    private String requestHeadersJson;

    @Lob
    private String requestBody;

    private int statusCode;

    @Lob
    private String responseHeadersJson;

    @Lob
    private String responseBody;

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