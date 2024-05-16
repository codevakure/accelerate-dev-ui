import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASuppliesandservicesComponent } from './a-suppliesandservices.component';

describe('ASuppliesandservicesComponent', () => {
  let component: ASuppliesandservicesComponent;
  let fixture: ComponentFixture<ASuppliesandservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASuppliesandservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASuppliesandservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
