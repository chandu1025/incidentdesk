import { TestBed } from '@angular/core/testing';
import { IncidentService } from './incident.service';

describe('IncidentService', () => {
  let service: IncidentService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentService);
  });

  it('derives open incidents and MTTR', () => {
    expect(service.open().length).toBeGreaterThan(0);
    expect(service.mttrMinutes()).toBeGreaterThan(0);
  });

  it('creates incidents newest first', () => {
    const created = service.create({ title: 'Test', service: 'Auth', severity: 'sev3', owner: 'QA' }, 'QA');
    expect(service.incidents()[0].id).toBe(created.id);
  });

  it('rolls back when persistence fails', async () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(false);
    const before = service.byId('INC-1001')!.status;
    await expectAsync(service.postUpdate('INC-1001', 'resolved', 'done', 'QA')).toBeRejected();
    expect(service.byId('INC-1001')!.status).toBe(before);
  });
});
