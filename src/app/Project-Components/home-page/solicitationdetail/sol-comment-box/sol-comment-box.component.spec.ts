import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolCommentBoxComponent } from './sol-comment-box.component';

describe('SolCommentBoxComponent', () => {
  let component: SolCommentBoxComponent;
  let fixture: ComponentFixture<SolCommentBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolCommentBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolCommentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
