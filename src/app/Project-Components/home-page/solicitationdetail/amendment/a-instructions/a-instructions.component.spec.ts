import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AInstructionsComponent } from './a-instructions.component';

describe('AInstructionsComponent', () => {
  let component: AInstructionsComponent;
  let fixture: ComponentFixture<AInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
