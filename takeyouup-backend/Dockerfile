# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — build the Spring Boot fat jar with JDK 21 + Maven
# ---------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Warm the dependency cache first (best-effort; package re-resolves as needed)
COPY pom.xml ./
RUN mvn -B -q -DskipTests dependency:go-offline || true

# Build the application
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------------------------------------------------------------------------
# Stage 2 — slim runtime image (JRE only)
# ---------------------------------------------------------------------------
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# curl is used by the compose health check
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Run as a non-root user
RUN groupadd --system app && useradd --system --gid app --home /app app

COPY --from=build /workspace/target/*.jar app.jar

# Directory for user file uploads (mounted as a volume in compose)
RUN mkdir -p /app/uploads && chown -R app:app /app
USER app

EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
