import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeValidateComponent } from './code-validate.component';

describe('CodeValidateComponent', () => {
  let component: CodeValidateComponent;
  let fixture: ComponentFixture<CodeValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
