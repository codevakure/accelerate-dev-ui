import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractFileComponent } from './contract-file.component';

describe('ContractFileComponent', () => {
  let component: ContractFileComponent;
  let fixture: ComponentFixture<ContractFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
