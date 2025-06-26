package com.janne.bitfrost.services;

import org.springframework.stereotype.Service;

@Service
public class TimeIntervalService {

    public int getTimeInterval(long numberOfRetries) {
        return (int) Math.min(60, Math.pow(2, Math.min(numberOfRetries, 100))) * 1000 ;
    }
}
