import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PENDINGREQUESTComponent } from './pendingrequest.component';

describe('PENDINGREQUESTComponent', () => {
  let component: PENDINGREQUESTComponent;
  let fixture: ComponentFixture<PENDINGREQUESTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PENDINGREQUESTComponent]
    });
    fixture = TestBed.createComponent(PENDINGREQUESTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
