import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sf30previewComponent } from './sf30preview.component';

describe('Sf30previewComponent', () => {
  let component: Sf30previewComponent;
  let fixture: ComponentFixture<Sf30previewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sf30previewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sf30previewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
