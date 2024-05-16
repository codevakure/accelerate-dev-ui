import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementofworkComponent } from './statementofwork.component';

describe('StatementofworkComponent', () => {
  let component: StatementofworkComponent;
  let fixture: ComponentFixture<StatementofworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementofworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementofworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
