import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegayKarUserViewComponent } from './admin-regay-kar-user-view.component';

describe('AdminRegayKarUserViewComponent', () => {
  let component: AdminRegayKarUserViewComponent;
  let fixture: ComponentFixture<AdminRegayKarUserViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRegayKarUserViewComponent]
    });
    fixture = TestBed.createComponent(AdminRegayKarUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
