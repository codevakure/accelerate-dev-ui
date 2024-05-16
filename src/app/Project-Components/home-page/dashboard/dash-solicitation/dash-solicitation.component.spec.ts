import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSolicitationComponent } from './dash-solicitation.component';

describe('DashSolicitationComponent', () => {
  let component: DashSolicitationComponent;
  let fixture: ComponentFixture<DashSolicitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashSolicitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSolicitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
