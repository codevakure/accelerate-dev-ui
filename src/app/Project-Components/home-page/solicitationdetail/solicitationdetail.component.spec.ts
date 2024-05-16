import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationdetailComponent } from './solicitationdetail.component';

describe('SolicitationdetailComponent', () => {
  let component: SolicitationdetailComponent;
  let fixture: ComponentFixture<SolicitationdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitationdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitationdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
