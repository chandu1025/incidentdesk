import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CanDirective } from '../../core/directives/can.directive';
import { IncidentStatus, STATUS_LABEL } from '../../core/models/incident.model';
import { AuthService } from '../../core/services/auth.service';
import { IncidentService } from '../../core/services/incident.service';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule, CanDirective, StatusBadgeComponent],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentDetailComponent {
  /** Bound from the :id route param via withComponentInputBinding(). */
  readonly id = input.required<string>();

  private readonly svc = inject(IncidentService);
  private readonly auth = inject(AuthService);

  protected readonly incident = computed(() => this.svc.incidents().find((i) => i.id === this.id()));
  protected readonly timeline = computed(() => [...(this.incident()?.updates ?? [])].reverse());
  protected readonly statuses = Object.entries(STATUS_LABEL) as [IncidentStatus, string][];
  protected readonly error = signal('');
  protected readonly saving = signal(false);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    status: ['identified' as IncidentStatus, Validators.required],
    message: ['', [Validators.required, Validators.minLength(3)]],
  });

  protected async post(): Promise<void> {
    const inc = this.incident();
    if (!inc || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.saving.set(true);
    const { status, message } = this.form.getRawValue();
    try {
      await this.svc.postUpdate(inc.id, status, message, this.auth.user()?.name ?? 'Unknown');
      this.form.controls.message.reset();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Could not save the update.');
    } finally {
      this.saving.set(false);
    }
  }
}
