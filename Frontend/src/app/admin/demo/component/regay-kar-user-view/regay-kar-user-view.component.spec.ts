import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegayKarUserViewComponent } from './regay-kar-user-view.component';

describe('RegayKarUserViewComponent', () => {
  let component: RegayKarUserViewComponent;
  let fixture: ComponentFixture<RegayKarUserViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegayKarUserViewComponent]
    });
    fixture = TestBed.createComponent(RegayKarUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
