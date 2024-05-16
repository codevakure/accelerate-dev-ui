import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmacquisitionsComponent } from './pmacquisitions.component';

describe('PmacquisitionsComponent', () => {
  let component: PmacquisitionsComponent;
  let fixture: ComponentFixture<PmacquisitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmacquisitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmacquisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
