import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AAttachmentComponent } from './a-attachment.component';

describe('AAttachmentComponent', () => {
  let component: AAttachmentComponent;
  let fixture: ComponentFixture<AAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
