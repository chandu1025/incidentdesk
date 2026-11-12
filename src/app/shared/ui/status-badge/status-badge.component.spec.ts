import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  it('renders the status label', () => {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('status', 'resolved');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Resolved');
  });
});
