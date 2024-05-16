import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsolComponent } from './pmsol.component';

describe('PmsolComponent', () => {
  let component: PmsolComponent;
  let fixture: ComponentFixture<PmsolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmsolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmsolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
