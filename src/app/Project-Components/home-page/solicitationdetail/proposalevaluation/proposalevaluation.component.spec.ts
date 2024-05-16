import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalevaluationComponent } from './proposalevaluation.component';

describe('ProposalevaluationComponent', () => {
  let component: ProposalevaluationComponent;
  let fixture: ComponentFixture<ProposalevaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalevaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
