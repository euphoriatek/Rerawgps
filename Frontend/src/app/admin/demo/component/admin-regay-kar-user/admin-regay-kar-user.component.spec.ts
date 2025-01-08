import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegayKarUserComponent } from './admin-regay-kar-user.component';

describe('AdminRegayKarUserComponent', () => {
  let component: AdminRegayKarUserComponent;
  let fixture: ComponentFixture<AdminRegayKarUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRegayKarUserComponent]
    });
    fixture = TestBed.createComponent(AdminRegayKarUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
