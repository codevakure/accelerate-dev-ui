import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AContractComponent } from './a-contract.component';

describe('AContractComponent', () => {
  let component: AContractComponent;
  let fixture: ComponentFixture<AContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
