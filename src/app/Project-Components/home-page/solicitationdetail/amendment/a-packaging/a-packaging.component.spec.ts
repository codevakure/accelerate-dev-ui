import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APackagingComponent } from './a-packaging.component';

describe('APackagingComponent', () => {
  let component: APackagingComponent;
  let fixture: ComponentFixture<APackagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ APackagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(APackagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
