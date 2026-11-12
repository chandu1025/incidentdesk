import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  it('toggles a flag', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    const sw: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.switch')[1];
    sw.click();
    fixture.detectChanges();
    expect(sw.getAttribute('aria-checked')).toBe('true');
  });
});
