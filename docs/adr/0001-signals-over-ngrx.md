# ADR 0001: Signals and facade services instead of NgRx

**Status:** Accepted

## Context
State is mostly list/detail data with a few derived values (open count, MTTR). Features are lazy-loaded and independent.

## Decision
Use Angular signals inside feature-scoped facade services (`IncidentService`). Derived data uses `computed`. Components never mutate state directly.

## Consequences
- Less boilerplate, no store dependency, simple to test.
- If cross-feature event orchestration grows, move to NgRx SignalStore without changing component code, because components already talk to a facade.
