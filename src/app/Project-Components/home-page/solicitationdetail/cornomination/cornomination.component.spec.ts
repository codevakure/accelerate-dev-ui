import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CornominationComponent } from './cornomination.component';

describe('CornominationComponent', () => {
  let component: CornominationComponent;
  let fixture: ComponentFixture<CornominationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CornominationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CornominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
