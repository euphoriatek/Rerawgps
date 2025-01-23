import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegayKarPlanComponent } from './regay-kar-plan.component';

describe('RegayKarPlanComponent', () => {
  let component: RegayKarPlanComponent;
  let fixture: ComponentFixture<RegayKarPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegayKarPlanComponent]
    });
    fixture = TestBed.createComponent(RegayKarPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
