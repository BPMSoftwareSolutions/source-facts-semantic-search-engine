-- Schemas for the source-facts-semantic-search-engine database.
-- inventory  : physical observation and workspace coverage.
-- source     : stable source identities and exact locations.
-- fact       : observed and derived source facts.
-- ingestion  : load control, staging, and reproducibility.
-- reporting  : views only. No base tables belong in this schema.
--
-- There is intentionally no "authority" schema yet: this engine does not currently
-- project any declared contract/ontology material into the fact model. Add it only
-- once a projector actually emits that data; do not pre-create empty capability.

IF SCHEMA_ID('inventory') IS NULL EXEC('CREATE SCHEMA inventory');
IF SCHEMA_ID('source') IS NULL EXEC('CREATE SCHEMA source');
IF SCHEMA_ID('fact') IS NULL EXEC('CREATE SCHEMA fact');
IF SCHEMA_ID('ingestion') IS NULL EXEC('CREATE SCHEMA ingestion');
IF SCHEMA_ID('reporting') IS NULL EXEC('CREATE SCHEMA reporting');
GO
