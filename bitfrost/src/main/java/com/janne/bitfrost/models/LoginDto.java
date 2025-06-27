package com.janne.bitfrost.models;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginDto {
    private String email;
    private String password;
}
