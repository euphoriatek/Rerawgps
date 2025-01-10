import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POIsComponent } from './pois.component';

describe('POIsComponent', () => {
  let component: POIsComponent;
  let fixture: ComponentFixture<POIsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POIsComponent]
    });
    fixture = TestBed.createComponent(POIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
