import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashAcquisitionComponent } from './dash-acquisition.component';

describe('DashAcquisitionComponent', () => {
  let component: DashAcquisitionComponent;
  let fixture: ComponentFixture<DashAcquisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashAcquisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashAcquisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
