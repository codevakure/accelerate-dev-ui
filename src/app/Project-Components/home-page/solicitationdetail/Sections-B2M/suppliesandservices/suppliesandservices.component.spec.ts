import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliesandservicesComponent } from './suppliesandservices.component';

describe('SuppliesandservicesComponent', () => {
  let component: SuppliesandservicesComponent;
  let fixture: ComponentFixture<SuppliesandservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliesandservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliesandservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
