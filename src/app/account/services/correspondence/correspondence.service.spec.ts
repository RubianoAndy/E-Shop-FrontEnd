import { TestBed } from '@angular/core/testing';

import { CorrespondenceService } from './correspondence.service';

describe('CorrespondenceService', () => {
  let service: CorrespondenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrespondenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
