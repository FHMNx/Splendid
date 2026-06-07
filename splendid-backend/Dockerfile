# STAGE 1: Build the Application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the dependency configuration files first to utilize Docker layer caching
COPY pom.xml .

# Download dependencies (this layer will be cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy the actual source code
COPY src ./src

# Compile and package the application into a JAR file, skipping tests since we test via CI/CD
RUN mvn clean package -DskipTests



# STAGE 2: Create the Lightweight Runtime Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the compiled JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 8080

# The execution command to launch the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]