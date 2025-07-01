package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.HttpExchangeLog;
import com.janne.bitfrost.entities.Job;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JobExecutorService {
    private final WebClient webClient;

    public JobExecutorService() {
        this.webClient = WebClient.create();
    }

    public Mono<HttpExchangeLog> executeJob(Job job) {
        log.info("Executing job {}", job);
        return sendPostRequest(job.getSubscription().getCallbackUrl(), job.getMessage().getMessage(), "TestAuth");
    }

    public Mono<HttpExchangeLog> sendPostRequest(String url, String payload, String authHeaderValue) {
        return webClient.post()
            .uri(url)
            .header(HttpHeaders.AUTHORIZATION, authHeaderValue)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(payload)
            .exchangeToMono(response -> response.bodyToMono(String.class)
                .defaultIfEmpty("")
                .map(body -> {
                    HttpExchangeLog log = new HttpExchangeLog();
                    log.setUri(url);
                    log.setMethod("POST");
                    log.setRequestBody(payload.toString());
                    log.setTimestamp(Instant.now());
                    log.setStatusCode(response.statusCode().value());

                    // Headers
                    Map<String, String> reqHeaders = Map.of(HttpHeaders.AUTHORIZATION, authHeaderValue);
                    log.setRequestHeaders(reqHeaders);

                    Map<String, String> respHeaders = response.headers().asHttpHeaders().entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, e -> String.join(",", e.getValue())));
                    log.setResponseHeaders(respHeaders);

                    log.setResponseBody(body);
                    return log;
                }))
            .onErrorResume(error -> {
                // Handle errors (e.g. timeouts, connection refused)
                HttpExchangeLog log = new HttpExchangeLog();
                log.setUri(url);
                log.setMethod("POST");
                log.setRequestBody(payload.toString());
                log.setTimestamp(Instant.now());
                if (error instanceof org.springframework.web.reactive.function.client.WebClientResponseException ex) {
                    log.setStatusCode(ex.getRawStatusCode());
                    log.setResponseBody(ex.getResponseBodyAsString());
                    log.setResponseHeaders(ex.getHeaders().entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, e -> String.join(",", e.getValue()))));
                } else {
                    log.setStatusCode(-1); // Unknown / transport-level failure
                    log.setResponseBody("Transport error: (INTERNAL) " + error.getMessage());
                }
                log.setRequestHeaders(Map.of(HttpHeaders.AUTHORIZATION, authHeaderValue));
                log.setResponseBody("Error: " + error.getMessage());

                return Mono.just(log);
            });
    }
}
