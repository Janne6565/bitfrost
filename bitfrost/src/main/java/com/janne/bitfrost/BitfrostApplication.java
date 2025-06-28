package com.janne.bitfrost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BitfrostApplication {

    public static void main(String[] args) {
        SpringApplication.run(BitfrostApplication.class, args);
    }

}
