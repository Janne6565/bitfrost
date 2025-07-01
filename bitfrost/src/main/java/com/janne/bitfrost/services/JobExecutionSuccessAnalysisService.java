package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.HttpExchangeLog;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class JobExecutionSuccessAnalysisService {

    public boolean checkJobSuccessful(HttpExchangeLog jobExecutionResult) {
        return jobExecutionResult.getStatusCode() != -1 && HttpStatus.valueOf(jobExecutionResult.getStatusCode()).is2xxSuccessful();
    }
}
