import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AInspectionComponent } from './a-inspection.component';

describe('AInspectionComponent', () => {
  let component: AInspectionComponent;
  let fixture: ComponentFixture<AInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
