import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractGenerationComponent } from './contract-generation.component';

describe('ContractGenerationComponent', () => {
  let component: ContractGenerationComponent;
  let fixture: ComponentFixture<ContractGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
