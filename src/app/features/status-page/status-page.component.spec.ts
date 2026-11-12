import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StatusPageComponent } from './status-page.component';

describe('StatusPageComponent', () => {
  it('reports an outage while a Sev 1 is open', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(StatusPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Some systems are down');
  });
});
