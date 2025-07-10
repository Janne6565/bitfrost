package com.janne.bitfrost.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TimeIntervalService {
    @Value("${app.max-retry-timeout}")
    private float maxTimeout;

    public int getTimeInterval(long numberOfRetries) {
        return (int) Math.min(maxTimeout, Math.pow(2, Math.min(numberOfRetries, 100))) * 1000;
    }
}
