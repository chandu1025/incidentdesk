import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidentService } from '../../core/services/incident.service';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

@Component({
  selector: 'app-status-page',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent],
  templateUrl: './status-page.component.html',
  styleUrl: './status-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPageComponent {
  private readonly svc = inject(IncidentService);
  protected readonly services = this.svc.serviceHealth;
  protected readonly open = this.svc.open;
  protected readonly overall = computed(() => {
    const levels = this.services().map((s) => s.level);
    if (levels.includes('outage')) return { tone: 'down', text: 'Some systems are down' };
    if (levels.includes('degraded')) return { tone: 'degraded', text: 'Some systems are degraded' };
    return { tone: 'up', text: 'All systems operational' };
  });
}
