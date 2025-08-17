package com.janne.bitfrost.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
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
    @Basic(fetch = FetchType.EAGER)
    @Lob
    private String requestHeadersJson;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column
    private String requestBody;

    @Column
    private int statusCode;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column
    private String responseHeadersJson;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column
    private String responseBody;

    @Column
    private Instant timestamp;

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

    @JsonIgnore
    public void setRequestHeaders(Map<String, String> headers) {
        this.requestHeadersJson = toJson(headers);
    }

    public Map<String, String> getResponseHeaders() {
        return fromJson(responseHeadersJson);
    }

    @JsonIgnore
    public void setResponseHeaders(Map<String, String> headers) {
        this.responseHeadersJson = toJson(headers);
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