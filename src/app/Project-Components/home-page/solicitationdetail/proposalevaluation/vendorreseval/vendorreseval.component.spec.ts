import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorresevalComponent } from './vendorreseval.component';

describe('VendorresevalComponent', () => {
  let component: VendorresevalComponent;
  let fixture: ComponentFixture<VendorresevalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorresevalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorresevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
