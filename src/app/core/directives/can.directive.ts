import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { Role } from '../models/incident.model';
import { AuthService } from '../services/auth.service';

/** Usage: <button *appCan="['admin','responder']">…</button> */
@Directive({ selector: '[appCan]', standalone: true })
export class CanDirective {
  readonly appCan = input.required<Role[]>();
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly auth = inject(AuthService);

  constructor() {
    effect(() => {
      this.vcr.clear();
      if (this.auth.hasRole(...this.appCan())) this.vcr.createEmbeddedView(this.tpl);
    });
  }
}
