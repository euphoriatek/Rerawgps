import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedServerComponent } from './assigned-server.component';

describe('AssignedServerComponent', () => {
  let component: AssignedServerComponent;
  let fixture: ComponentFixture<AssignedServerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedServerComponent]
    });
    fixture = TestBed.createComponent(AssignedServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
