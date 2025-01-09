FROM openjdk:17-jdk-slim
VOLUME /tmp
ARG JAR_FILE=target/review-service-1.0.0.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]
