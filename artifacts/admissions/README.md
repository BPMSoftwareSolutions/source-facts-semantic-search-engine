# Mechanic Authority Inspection Projections

Files under this directory are optional, disposable inspection projections.
They are not admitted authority and are never read by runtime projections.
SQL `authority.MechanicAuthorityAdmission` is the sole durable admitted store.

New exports use `mechanic-authority-inspection-projection.v1` and carry
`NON_AUTHORITATIVE_INSPECTION_PROJECTION`, source-analysis CAS digests, lowerer
version, and a digest of the nested authority payload. The manual admission CLI
accepts only that validated wrapper.

Raw JSON files created before the inspection wrapper was introduced are legacy
diagnostic snapshots. They are intentionally non-admissible and may be deleted
without changing current SQL authority.
