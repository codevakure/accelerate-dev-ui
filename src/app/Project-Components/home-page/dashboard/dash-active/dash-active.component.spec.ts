import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashActiveComponent } from './dash-active.component';

describe('DashActiveComponent', () => {
  let component: DashActiveComponent;
  let fixture: ComponentFixture<DashActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
