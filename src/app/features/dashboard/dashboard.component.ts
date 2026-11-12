import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidentService } from '../../core/services/incident.service';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, StatCardComponent, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly svc = inject(IncidentService);
  protected readonly open = this.svc.open;
  protected readonly sev1 = this.svc.activeSev1;
  protected readonly mttr = this.svc.mttrMinutes;
  protected readonly weekly = this.svc.weekly;
  protected readonly recent = computed(() => this.svc.incidents().slice(0, 5));
  protected readonly maxCount = computed(() => Math.max(1, ...this.weekly().map((w) => w.count)));
}
