package com.janne.bitfrost.configs;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.services.JwtService;
import com.janne.bitfrost.services.ProjectService;
import com.janne.bitfrost.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;
    private final ProjectService projectService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("Executor ")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authHeader.startsWith("Executor ")) {
            String authToken = authHeader.substring(9);
            processExecutorToken(authToken, filterChain, request, response);
        } else if (authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            processJwt(token, filterChain, request, response);
        }

        filterChain.doFilter(request, response);
    }

    private void processExecutorToken(String token, FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) {
        if (!token.contains(":")) {
            return;
        }
        String[] parts = token.split(":");
        if (parts.length != 2) {
            return;
        }
        Optional<Project> project = projectService.getProjectByTag(parts[0]);
        if (project.isEmpty() || !project.get().getProjectSecret().equals(parts[1])) {
            return;
        }
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken("PROJECT_" + parts[0], null, List.of(new SimpleGrantedAuthority("ROLE_EXECUTOR")));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void processJwt(String token, FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) {
        try {
            Jwt claims = jwtService.parseJwt(token, JwtService.TokenType.IDENTITY_TOKEN);
            String userId = claims.getSubject();
            if (userService.getUser(userId).isEmpty()) {
                filterChain.doFilter(request, response);
                return;
            }
            User.UserRole userRole = User.UserRole.valueOf(claims.getClaimAsString("role"));

            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + userRole));
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken("USER_" + userId, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ignored) {
        }
    }
}
