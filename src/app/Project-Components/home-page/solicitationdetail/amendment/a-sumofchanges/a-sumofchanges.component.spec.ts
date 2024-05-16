import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASumofchangesComponent } from './a-sumofchanges.component';

describe('ASumofchangesComponent', () => {
  let component: ASumofchangesComponent;
  let fixture: ComponentFixture<ASumofchangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASumofchangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASumofchangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
