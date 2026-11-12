# ADR 0002: Optimistic status updates with rollback

**Status:** Accepted

Responders change incident status under pressure; waiting on a round trip feels broken. We update the signal immediately, persist in the background, and restore the previous snapshot if persistence fails. The UI surfaces the failure through a visible error message.
