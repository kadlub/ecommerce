# Bazowy obraz JDK 17
FROM openjdk:17-jdk-slim

# Definiowanie wolumenu tymczasowego
VOLUME /tmp

# Zmienna ARG dla pliku JAR aplikacji
ARG JAR_FILE=target/product-service-1.0.0.jar

# Kopiowanie pliku JAR aplikacji do obrazu
COPY ${JAR_FILE} app.jar

# Kopiowanie zdjęć z katalogu źródłowego do obrazu Dockera
COPY src/main/java/com/example/product_service/uploads/products /uploads/products

# Ustawienie zmiennej środowiskowej wskazującej na katalog uploadów
ENV UPLOADS_DIR=/uploads/products

# Ustawienie portu, na którym działa aplikacja
ENTRYPOINT ["java", "-Dserver.port=8082", "-jar", "/app.jar"]
