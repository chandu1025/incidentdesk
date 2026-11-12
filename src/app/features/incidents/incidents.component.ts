import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CanDirective } from '../../core/directives/can.directive';
import { IncidentStatus, SERVICES, STATUS_LABEL, Severity } from '../../core/models/incident.model';
import { AuthService } from '../../core/services/auth.service';
import { IncidentService } from '../../core/services/incident.service';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule, CanDirective, StatusBadgeComponent],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentsComponent {
  private readonly svc = inject(IncidentService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly services = SERVICES;
  protected readonly statuses = Object.entries(STATUS_LABEL) as [IncidentStatus, string][];
  protected readonly severities: Severity[] = ['sev1', 'sev2', 'sev3'];

  protected readonly query = signal('');
  protected readonly statusFilter = signal<IncidentStatus | 'all'>('all');
  protected readonly showForm = signal(false);

  protected readonly rows = computed(() => {
    const q = this.query().toLowerCase();
    const s = this.statusFilter();
    return this.svc
      .incidents()
      .filter((i) => (s === 'all' || i.status === s) && (!q || `${i.title} ${i.id} ${i.service}`.toLowerCase().includes(q)));
  });

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    service: [SERVICES[0] as string, Validators.required],
    severity: ['sev2' as Severity, Validators.required],
  });

  protected create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const owner = this.auth.user()?.name ?? 'Unassigned';
    const created = this.svc.create({ ...this.form.getRawValue(), owner }, owner);
    this.form.reset();
    this.showForm.set(false);
    void this.router.navigate(['/incidents', created.id]);
  }
}
