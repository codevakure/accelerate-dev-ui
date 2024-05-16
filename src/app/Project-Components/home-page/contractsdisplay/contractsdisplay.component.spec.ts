import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsdisplayComponent } from './contractsdisplay.component';

describe('ContractsdisplayComponent', () => {
  let component: ContractsdisplayComponent;
  let fixture: ComponentFixture<ContractsdisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsdisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
