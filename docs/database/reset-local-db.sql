-- InsureHub LOCAL DEVELOPMENT ONLY
-- WARNING: this permanently deletes all data in the insurehub database.
-- Run only when you are sure the database contains no data you need.

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
