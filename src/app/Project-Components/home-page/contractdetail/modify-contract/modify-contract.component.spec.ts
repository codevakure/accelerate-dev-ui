import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyContractComponent } from './modify-contract.component';

describe('ModifyContractComponent', () => {
  let component: ModifyContractComponent;
  let fixture: ComponentFixture<ModifyContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
