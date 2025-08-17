package com.janne.bitfrost.models;

import com.janne.bitfrost.entities.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    public String uuid;
    public String email;
    public String name;

    public static UserDto from(User user) {
        return UserDto.builder()
            .uuid(user.getUuid())
            .email(user.getEmail())
            .name(user.getName())
            .build();
    }
}
