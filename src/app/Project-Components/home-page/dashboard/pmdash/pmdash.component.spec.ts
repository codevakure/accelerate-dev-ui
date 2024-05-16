import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmdashComponent } from './pmdash.component';

describe('PmdashComponent', () => {
  let component: PmdashComponent;
  let fixture: ComponentFixture<PmdashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmdashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
