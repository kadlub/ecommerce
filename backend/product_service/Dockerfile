FROM openjdk:17-jdk-slim
VOLUME /tmp
ARG JAR_FILE=target/product-service-1.0.0.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Dserver.port=8082", "-jar", "/app.jar"]
