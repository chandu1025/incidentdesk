import { Injectable, computed, signal } from '@angular/core';
import { Role, User } from '../models/incident.model';

const KEY = 'incidentdesk.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this.restore());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(name: string, role: Role): void {
    const user = { name: name.trim(), role };
    this._user.set(user);
    try {
      localStorage.setItem(KEY, JSON.stringify(user));
    } catch {
      /* storage unavailable: session stays in memory */
    }
  }

  logout(): void {
    this._user.set(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }

  hasRole(...roles: Role[]): boolean {
    const u = this._user();
    return !!u && roles.includes(u.role);
  }

  private restore(): User | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
