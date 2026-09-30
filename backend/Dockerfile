# Build Stage
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy maven wrapper and pom.xml first for dependency caching
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and build package
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create a volume or directory for data persistence
RUN mkdir -p /app/data

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
