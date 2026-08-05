-- Schemas for the source-facts-semantic-search-engine database.
-- inventory  : physical observation and workspace coverage.
-- source     : stable source identities and exact locations.
-- fact       : observed and derived source facts.
-- ingestion  : load control, staging, and reproducibility.
-- reporting  : views only. No base tables belong in this schema.
--
-- Declared authority and observed engineering truth deliberately occupy separate
-- schemas.  The source-fact tables remain observational; governed contracts are
-- loaded into authority/lineage/artifact and are joined to observations only via
-- explicit binding and proof rows.

IF SCHEMA_ID('inventory') IS NULL EXEC('CREATE SCHEMA inventory');
IF SCHEMA_ID('source') IS NULL EXEC('CREATE SCHEMA source');
IF SCHEMA_ID('fact') IS NULL EXEC('CREATE SCHEMA fact');
IF SCHEMA_ID('ingestion') IS NULL EXEC('CREATE SCHEMA ingestion');
IF SCHEMA_ID('reporting') IS NULL EXEC('CREATE SCHEMA reporting');
IF SCHEMA_ID('authority') IS NULL EXEC('CREATE SCHEMA authority');
IF SCHEMA_ID('lineage') IS NULL EXEC('CREATE SCHEMA lineage');
IF SCHEMA_ID('artifact') IS NULL EXEC('CREATE SCHEMA artifact');
IF SCHEMA_ID('observation') IS NULL EXEC('CREATE SCHEMA observation');
IF SCHEMA_ID('binding') IS NULL EXEC('CREATE SCHEMA binding');
IF SCHEMA_ID('test') IS NULL EXEC('CREATE SCHEMA test');
IF SCHEMA_ID('proof') IS NULL EXEC('CREATE SCHEMA proof');
GO
