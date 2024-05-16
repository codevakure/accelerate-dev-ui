import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractadmindataComponent } from './contractadmindata.component';

describe('ContractadmindataComponent', () => {
  let component: ContractadmindataComponent;
  let fixture: ComponentFixture<ContractadmindataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractadmindataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractadmindataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
