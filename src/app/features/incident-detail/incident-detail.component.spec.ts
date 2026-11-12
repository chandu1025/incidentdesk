import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IncidentDetailComponent } from './incident-detail.component';

describe('IncidentDetailComponent', () => {
  it('shows a recovery state for unknown ids', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(IncidentDetailComponent);
    fixture.componentRef.setInput('id', 'INC-0');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Incident not found');
  });
});
