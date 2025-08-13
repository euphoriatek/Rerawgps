import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestComponent } from './pendingrequest.component';

describe('PENDINGREQUESTComponent', () => {
  let component: PendingRequestComponent;
  let fixture: ComponentFixture<PendingRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingRequestComponent]
    });
    fixture = TestBed.createComponent(PendingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
