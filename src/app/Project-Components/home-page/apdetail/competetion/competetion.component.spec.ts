import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetetionComponent } from './competetion.component';

describe('CompetetionComponent', () => {
  let component: CompetetionComponent;
  let fixture: ComponentFixture<CompetetionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetetionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
