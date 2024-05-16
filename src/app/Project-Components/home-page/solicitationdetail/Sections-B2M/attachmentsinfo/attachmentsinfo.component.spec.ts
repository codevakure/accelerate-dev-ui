import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsinfoComponent } from './attachmentsinfo.component';

describe('AttachmentsinfoComponent', () => {
  let component: AttachmentsinfoComponent;
  let fixture: ComponentFixture<AttachmentsinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
