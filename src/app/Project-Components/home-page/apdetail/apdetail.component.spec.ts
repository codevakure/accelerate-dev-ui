import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApdetailComponent } from './apdetail.component';

describe('ApdetailComponent', () => {
  let component: ApdetailComponent;
  let fixture: ComponentFixture<ApdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
