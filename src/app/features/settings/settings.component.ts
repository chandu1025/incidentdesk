import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Flag { key: string; label: string; description: string; on: boolean }
const STORE = 'incidentdesk.flags';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  protected readonly flags = signal<Flag[]>(this.load());

  protected toggle(key: string): void {
    this.flags.update((list) => list.map((f) => (f.key === key ? { ...f, on: !f.on } : f)));
    try {
      localStorage.setItem(STORE, JSON.stringify(this.flags().map(({ key: k, on }) => [k, on])));
    } catch {
      /* storage unavailable */
    }
  }

  private load(): Flag[] {
    const base: Flag[] = [
      { key: 'live', label: 'Live timeline', description: 'Stream new updates to open incident pages.', on: true },
      { key: 'presence', label: 'Presence', description: 'Show who else is viewing an incident.', on: false },
      { key: 'autopage', label: 'Auto-page owner', description: 'Notify the owner when severity changes.', on: false },
    ];
    try {
      const saved = new Map<string, boolean>(JSON.parse(localStorage.getItem(STORE) ?? '[]'));
      return base.map((f) => ({ ...f, on: saved.get(f.key) ?? f.on }));
    } catch {
      return base;
    }
  }
}
