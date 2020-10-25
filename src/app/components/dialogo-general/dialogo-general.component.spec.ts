import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoGeneralComponent } from './dialogo-general.component';

describe('DialogoGeneralComponent', () => {
  let component: DialogoGeneralComponent;
  let fixture: ComponentFixture<DialogoGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
