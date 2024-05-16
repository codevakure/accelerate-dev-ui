import { TestBed } from '@angular/core/testing';

import { QandaService } from './qanda.service';

describe('QandaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QandaService = TestBed.get(QandaService);
    expect(service).toBeTruthy();
  });
});
