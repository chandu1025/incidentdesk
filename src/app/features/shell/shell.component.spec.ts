import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  it('hides settings link from non-admins', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    TestBed.inject(AuthService).login('Sam', 'viewer');
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Settings');
  });
});
