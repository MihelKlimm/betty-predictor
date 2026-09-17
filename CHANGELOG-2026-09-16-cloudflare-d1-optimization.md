# CHANGELOG 2026-09-16 — Cloudflare D1 Optimization Plan

## Purpose

This document records the investigation and staged optimization plan created
after Cloudflare reported that the account had reached 92% of the Workers Free
daily D1 `rows_written` limit.

Production must remain unchanged until the owner explicitly approves a
production rollout.

## Cloudflare alert

Cloudflare reported:

- Daily free-tier write limit: `100,000 rows_written`
- Usage at alert time: `92%`
- Limit reset: `2026-09-16 00:00 UTC`

This is a D1 write-quota warning, not evidence of CPU overload, storage
exhaustion, excessive reads, or a database corruption event. If the account
exceeds the daily write limit, D1 write operations may fail until the quota
resets.

## Investigation completed today

The Worker configuration and write paths were reviewed without accessing or
changing remote production data.

The main likely source of unnecessary writes is the hourly production cron:

```text
0 * * * *
```

The hourly path updates match statuses and then calls `rebuildMarts()`. That
function performs a full delete-and-reinsert rebuild of:

- `silver_dim_user`
- `silver_dim_week`
- `silver_dim_team`
- `silver_fact_bet`
- `silver_fact_result`
- `silver_fact_score`
- `gold_champions`
- `gold_leaderboard`

This can write many rows even when the underlying operational data has not
changed. Friday synchronization and other scheduled paths can also trigger
mart rebuilding.

The dev Worker has no cron triggers, but dev intentionally shares the
production D1 database. Therefore remote dev migrations and write-heavy tests
must be treated as shared-database operations.

## Work completed

Optimization work is isolated on the branch:

```text
optimize-d1-writes
```

Current optimization commit:

```text
8b5df63 Reduce redundant D1 mart rebuild writes
```

The isolated change:

1. Adds a `worker_state` table through
   `cf-worker/migrations/004_mart_refresh_state.sql`.
2. Tracks a fingerprint of source-table counts, timestamps, scores, and
   challenge points.
3. Changes scheduled hourly/Friday-style rebuild calls to skip the full mart
   rebuild when the source fingerprint is unchanged.
4. Preserves manual/admin full rebuild paths.
5. Does not change scoring rules, API responses, challenge data, domain
   routing, frontend behavior, or cron schedules.

The baseline [schema.sql](cf-worker/schema.sql) also declares `worker_state`
for new local installations.

## Validation completed today

All validation was local or dry-run only:

- Worker JavaScript syntax check passed.
- Wrangler Worker dry-run passed.
- Frontend `npm run build` passed.
- A disposable local D1 database was created.
- The existing baseline schema was applied.
- A temporary compatibility column was added only to the disposable local
  database because the historical migration chain expects an existing
  `matches.week_id` column.
- All migrations, including `004_mart_refresh_state.sql`, were applied
  successfully in the corrected disposable database.
- `worker_state`, operational tables, challenges, and challenge predictions
  were confirmed locally.
- Temporary test databases and compatibility files were removed.

No remote D1 migration, Worker deployment, production branch change, or
production data change was performed.

## Follow-up validation — 2026-09-17

The focused behavior checks were run against a disposable local D1 database and
local Worker runtime:

- First scheduled refresh created `worker_state.marts_source_signature`.
- A second scheduled refresh with unchanged source data preserved the existing
  state timestamp, confirming the full mart rebuild was skipped.
- A new user source row changed the signature and triggered a refresh.
- A new match changed the signature and triggered a refresh.
- A new challenge changed the signature and triggered a refresh.
- A new challenge prediction changed the signature and triggered a refresh.
- The local `/health` endpoint remained healthy.
- Wrangler's `/__scheduled` test route returned successfully for the hourly
  schedule.
- The manual rebuild path remains a direct call to `rebuildMarts()` and was
  not replaced by the skip-aware wrapper.

The local runtime reported the expected missing Google Sheets secrets while
testing the scheduled path. That is a local configuration limitation and does
not affect the D1 fingerprint check.

The disposable local database, test user/data, and runtime were removed after
validation.

## Important migration finding

A completely empty local D1 cannot apply the repository's historical
migrations from zero because `0004_v2_fixtures.sql` assumes the already
existing operational schema includes `matches.week_id`.

This is a pre-existing migration-baseline issue, not a failure introduced by
the optimization. The corrected local test used a disposable baseline that
mirrors the existing operational schema before applying migrations.

Before any remote rollout, the actual remote migration state must be inspected
and the additive migration must be applied before deploying Worker code that
reads `worker_state`.

## Planned next steps

The following steps are intentionally not yet completed:

1. Review the fingerprint logic against representative operational data.
2. ~~Add focused tests or a local harness proving~~ **Completed locally**:
   - first rebuild runs;
   - unchanged source data skips;
   - a changed user source row invalidates the fingerprint;
   - a changed match result invalidates the fingerprint;
   - a changed challenge result invalidates the fingerprint;
   - manual rebuild still runs.
3. Inspect the remote migration state without applying changes.
4. Prepare a rollback procedure for the Worker code.
5. If approved, apply the additive migration and Worker update in a
   controlled non-production/remote test window.
6. Monitor D1 writes, Worker errors, and leaderboard output.
7. Only after successful observation, request separate approval for production.

## Current hold point

Do not:

- deploy the optimization to production;
- apply the migration to the shared remote D1;
- change cron schedules;
- change the frontend or Release 2.1 quiz;
- upgrade the Cloudflare plan solely based on this alert.

The current recommendation remains: validate and measure the write reduction
first, then decide whether a paid Workers plan is still necessary for the
expected public traffic.
