package com.janne.bitfrost.models;

import com.janne.bitfrost.entities.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicUserDto {
    private String uuid;
    private String name;

    public static PublicUserDto from(User user) {
        return PublicUserDto.builder()
            .uuid(user.getUuid())
            .name(user.getName())
            .build();
    }
}
