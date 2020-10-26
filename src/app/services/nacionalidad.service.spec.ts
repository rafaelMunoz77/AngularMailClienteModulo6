import { TestBed } from '@angular/core/testing';

import { NacionalidadService } from './nacionalidad.service';

describe('NacionalidadService', () => {
  let service: NacionalidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NacionalidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
