# Stage 1: build the jar
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src src
RUN mvn clean package -DskipTests -B

# Stage 2: run the jar
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the fat jar (Spring Boot creates a runnable jar under target/)
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R 1000:1000 /app

# Run as non-root
USER 1000:1000
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
