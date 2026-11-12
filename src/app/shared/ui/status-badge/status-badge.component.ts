import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IncidentStatus, SEVERITY_LABEL, STATUS_LABEL, Severity } from '../../../core/models/incident.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly status = input<IncidentStatus>();
  readonly severity = input<Severity>();

  protected readonly label = computed(() => {
    const s = this.status();
    const v = this.severity();
    return s ? STATUS_LABEL[s] : v ? SEVERITY_LABEL[v] : '';
  });
  protected readonly tone = computed(() => {
    const s = this.status();
    if (s) return { investigating: 'danger', identified: 'warn', monitoring: 'info', resolved: 'ok' }[s];
    return { sev1: 'danger', sev2: 'warn', sev3: 'info' }[this.severity() ?? 'sev3'];
  });
}
