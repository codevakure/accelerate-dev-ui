import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AContractadmindataComponent } from './a-contractadmindata.component';

describe('AContractadmindataComponent', () => {
  let component: AContractadmindataComponent;
  let fixture: ComponentFixture<AContractadmindataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AContractadmindataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AContractadmindataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
