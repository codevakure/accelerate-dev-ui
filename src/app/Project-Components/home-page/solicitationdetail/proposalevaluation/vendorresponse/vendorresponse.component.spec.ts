import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorresponseComponent } from './vendorresponse.component';

describe('VendorresponseComponent', () => {
  let component: VendorresponseComponent;
  let fixture: ComponentFixture<VendorresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
