graph TD
    subgraph BackendAPI ["Backend API (модульный монолит Java/Kotlin Spring Boot)"]
        
        subgraph ScheduleDomain ["Schedule Domain"]
            SC[ScheduleController] --> SS[ScheduleService]
            SS --> SR[ScheduleRepository]
        end

        subgraph ApplicationsDomain ["Applications Domain"]
            AC[ApplicationController] --> AS[ApplicationService]
            AS --> DS[DecisionService]
            AS --> AR[ApplicationRepository]
            DS --> AR
        end

        subgraph PassesDomain ["Passes Domain"]
            PC[PassController] --> PS[PassService]
            PS --> PR[PassRepository]
        end

        subgraph NotificationsDomain ["Notifications Domain"]
            NS[NotificationService]
        end

        subgraph CommonLayer ["Common Layer"]
            IA[IntegrationAdapters<br/>Moodle + Библиотека]
            FA[FinanceAdapter<br/>1С REST]
            Audit[AuditService]
        end

        %% Зависимости внутри доменов
        SC --> SS
        SS --> SR
        AC --> AS
        AS --> DS
        AS --> AR
        DS --> AR
        PC --> PS
        PS --> PR
        NS --> Audit

        %% Вызовы адаптеров
        SS --> IA
        AS --> IA
        PS --> IA
        AS --> FA
        NS --> IA

        %% Аудит от всех доменов
        SS -.-> Audit
        AS -.-> Audit
        DS -.-> Audit
        PS -.-> Audit
    end

    %% Внешний брокер (для уведомлений)
    MB[Message Broker<br/>RabbitMQ] -.-> NS

    classDef domain fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef common fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    class ScheduleDomain,ApplicationsDomain,PassesDomain,NotificationsDomain domain
    class CommonLayer common
