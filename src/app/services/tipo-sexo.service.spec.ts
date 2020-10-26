import { TestBed } from '@angular/core/testing';

import { TipoSexoService } from './tipo-sexo.service';

describe('TipoSexoService', () => {
  let service: TipoSexoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoSexoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
