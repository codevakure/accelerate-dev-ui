import { TestBed } from '@angular/core/testing';

import { CorsService } from './cors.service';

describe('CorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorsService = TestBed.get(CorsService);
    expect(service).toBeTruthy();
  });
});
