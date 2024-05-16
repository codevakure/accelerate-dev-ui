import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashExpiredComponent } from './dash-expired.component';

describe('DashExpiredComponent', () => {
  let component: DashExpiredComponent;
  let fixture: ComponentFixture<DashExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
