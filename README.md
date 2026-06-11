# SocialApp (Spring Boot)

Minimal Spring Boot social media REST API sample.

Quick start

1. Configure MySQL and update `src/main/resources/application.properties` with credentials and database name.
2. Build and run:

```bash
mvn spring-boot:run
```

APIs
- `POST /api/users` create user
- `GET /api/users` list users
- `POST /api/posts` create post
- `GET /api/posts` list posts
