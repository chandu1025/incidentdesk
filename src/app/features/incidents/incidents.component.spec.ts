import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IncidentsComponent } from './incidents.component';

describe('IncidentsComponent', () => {
  it('lists seeded incidents', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(IncidentsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBeGreaterThan(3);
  });
});
