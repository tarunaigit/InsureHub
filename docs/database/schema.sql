-- Reference schema for viva/reporting. JPA Hibernate remains the source of runtime schema generation in local development.

-- Core relationships:
-- users 1:N policies
-- insurance_plans 1:N policies
-- policies 1:N policy_history
-- policies 1:N payments

-- The application uses ddl-auto=update for local development.
-- For production deployments, switch to migrations (Flyway/Liquibase) before use.
