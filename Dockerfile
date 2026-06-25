# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Package the application skipping tests to speed up the build
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copy the built jar file from the builder stage
COPY --from=builder /app/target/socialapp-0.0.1-SNAPSHOT.jar app.jar
# Expose the standard port (Render will override via PORT env var)
EXPOSE 8081
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
