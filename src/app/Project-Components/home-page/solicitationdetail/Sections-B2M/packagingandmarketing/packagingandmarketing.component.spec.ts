import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingandmarketingComponent } from './packagingandmarketing.component';

describe('PackagingandmarketingComponent', () => {
  let component: PackagingandmarketingComponent;
  let fixture: ComponentFixture<PackagingandmarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingandmarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingandmarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
