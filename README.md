```
flowchart LR
    %% Стили для рамок и элементов
    classDef boundary fill:none,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5;
    classDef trustBoundary fill:#fcfcfc,stroke:#d32f2f,stroke-width:2px,stroke-dasharray: 5 5;
    classDef extSys fill:#7b7b7b,stroke:#333,color:#fff;
    classDef container fill:#1168bd,stroke:#0b4884,color:#fff;
    classDef db fill:#438dd5,stroke:#0b4884,color:#fff;

    %% Внешние системы (за пределами большой рамки)
    ExtMoodle["Moodle / 1С / Библиотека"]:::extSys
    ExtSMS["SMS-шлюз / Email"]:::extSys

    %% Шаг 2. Большая рамка системы
    subgraph SmartCampus["SmartCampus (System Boundary)"]
        direction LR
        
        %% Шаг 3 и 4. Untrusted zone
        subgraph Untrusted["Untrusted zone (internet + clients)"]
            direction TB
            WebUI["Web UI\n(Браузер)"]:::container
            MobileApp["Mobile App"]:::container
            Gateway["API Gateway"]:::container
        end

        %% Шаг 3 и 4. Trusted zone
        subgraph Trusted["Trusted zone (backend + хранилища)"]
            direction TB
            Backend["Backend API"]:::container
            Redis[("Redis Cache")]:::db
            PostgreSQL[("PostgreSQL")]:::db
            Broker[["Message Broker\n(RabbitMQ)"]]:::container
            Notification["Notification Service"]:::container
        end
    end

    %% Шаг 5 и 6. Стрелки, подписи и точки аутентификации (замки)
    WebUI -- "просмотр расписания, заявления (HTTP)\n🔒 SSO (Keycloak)" --> Gateway
    MobileApp -- "тот же HTTP\n🔒 SSO (Keycloak)" --> Gateway
    
    Gateway -- "внутренний вызов" --> Backend

    Backend <-->|"кэш расписания (Redis)"| Redis
    Backend <-->|"хранение заявлений, аудит (PostgreSQL)"| PostgreSQL
    Backend -. "публикует события\n(RequestSubmitted...)" .-> Broker
    Broker -. "обработка событий" .-> Notification

    Notification -. "отправка уведомлений (async)" .-> ExtSMS
    Backend -- "адаптеры (REST/SOAP)" --> ExtMoodle

    %% Применение стилей границ
    class SmartCampus boundary;
    class Untrusted,Trusted trustBoundary;
    ```
