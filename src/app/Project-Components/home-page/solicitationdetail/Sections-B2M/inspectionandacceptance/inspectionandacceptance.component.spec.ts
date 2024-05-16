import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionandacceptanceComponent } from './inspectionandacceptance.component';

describe('InspectionandacceptanceComponent', () => {
  let component: InspectionandacceptanceComponent;
  let fixture: ComponentFixture<InspectionandacceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionandacceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionandacceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
