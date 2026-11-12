import { Injectable, computed, signal } from '@angular/core';
import { Incident, IncidentStatus, NewIncident, SERVICES } from '../models/incident.model';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function seed(): Incident[] {
  const now = Date.now();
  const mk = (
    n: number, title: string, service: string, severity: Incident['severity'],
    status: IncidentStatus, owner: string, ageMs: number, durMs?: number,
  ): Incident => {
    const createdAt = now - ageMs;
    const resolvedAt = status === 'resolved' && durMs ? createdAt + durMs : undefined;
    return {
      id: `INC-${1000 + n}`, title, service, severity, status, owner, createdAt, resolvedAt,
      updates: [
        { at: createdAt, status: 'investigating', author: owner, message: 'Alert fired. Starting investigation.' },
        ...(status !== 'investigating'
          ? [{ at: createdAt + 20 * MIN, status, author: owner, message: `Moved to ${status}.` }]
          : []),
      ],
    };
  };
  return [
    mk(1, 'Elevated 5xx on checkout requests', 'Payments', 'sev1', 'identified', 'Meera Rao', 2 * HOUR),
    mk(2, 'Login latency above 2s for EU users', 'Auth', 'sev2', 'investigating', 'Dan Okafor', 45 * MIN),
    mk(3, 'Delayed push notifications', 'Notifications', 'sev3', 'monitoring', 'Priya Nair', 6 * HOUR),
    mk(4, 'Search index lagging by 15 minutes', 'Search', 'sev3', 'resolved', 'Dan Okafor', 2 * DAY, 90 * MIN),
    mk(5, 'Gateway timeouts after deploy 412', 'API Gateway', 'sev1', 'resolved', 'Meera Rao', 4 * DAY, 55 * MIN),
    mk(6, 'Webhook retries piling up', 'Notifications', 'sev2', 'resolved', 'Priya Nair', 9 * DAY, 3 * HOUR),
    mk(7, 'Token refresh failures', 'Auth', 'sev2', 'resolved', 'Meera Rao', 15 * DAY, 70 * MIN),
    mk(8, 'Payout batch stuck', 'Payments', 'sev1', 'resolved', 'Dan Okafor', 22 * DAY, 4 * HOUR),
  ];
}

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private readonly _items = signal<Incident[]>(seed());
  readonly incidents = this._items.asReadonly();

  readonly open = computed(() => this._items().filter((i) => i.status !== 'resolved'));
  readonly activeSev1 = computed(() => this.open().filter((i) => i.severity === 'sev1').length);

  /** Mean time to resolve, in minutes, across resolved incidents. */
  readonly mttrMinutes = computed(() => {
    const done = this._items().filter((i) => i.resolvedAt);
    if (!done.length) return 0;
    const total = done.reduce((sum, i) => sum + (i.resolvedAt! - i.createdAt), 0);
    return Math.round(total / done.length / MIN);
  });

  /** Incident counts for the last six weeks, oldest first. */
  readonly weekly = computed(() => {
    const now = Date.now();
    const buckets = Array.from({ length: 6 }, (_, i) => ({ label: `W-${5 - i}`, count: 0 }));
    for (const inc of this._items()) {
      const weeksAgo = Math.floor((now - inc.createdAt) / (7 * DAY));
      if (weeksAgo < 6) buckets[5 - weeksAgo].count++;
    }
    buckets[5].label = 'This wk';
    return buckets;
  });

  /** Worst open status per service, used by the public status page. */
  readonly serviceHealth = computed(() =>
    SERVICES.map((name) => {
      const open = this.open().filter((i) => i.service === name);
      const level = open.some((i) => i.severity === 'sev1') ? 'outage' : open.length ? 'degraded' : 'operational';
      return { name, level, incidents: open };
    }),
  );

  byId(id: string): Incident | undefined {
    return this._items().find((i) => i.id === id);
  }

  create(input: NewIncident, author: string): Incident {
    const now = Date.now();
    const incident: Incident = {
      id: `INC-${1000 + this._items().length + 1}`,
      ...input,
      status: 'investigating',
      createdAt: now,
      updates: [{ at: now, status: 'investigating', author, message: 'Incident opened.' }],
    };
    this._items.update((list) => [incident, ...list]);
    return incident;
  }

  /** Optimistic update: apply immediately, roll back if persistence fails. */
  async postUpdate(id: string, status: IncidentStatus, message: string, author: string): Promise<void> {
    const snapshot = this._items();
    const at = Date.now();
    this._items.update((list) =>
      list.map((i) =>
        i.id === id
          ? {
              ...i,
              status,
              resolvedAt: status === 'resolved' ? at : undefined,
              updates: [...i.updates, { at, status, message, author }],
            }
          : i,
      ),
    );
    try {
      await this.persist();
    } catch (err) {
      this._items.set(snapshot);
      throw err;
    }
  }

  private persist(): Promise<void> {
    return new Promise((resolve, reject) =>
      setTimeout(() => (navigator.onLine ? resolve() : reject(new Error('You are offline. Update was not saved.'))), 350),
    );
  }
}
