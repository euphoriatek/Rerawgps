import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAgentsComponent } from './sales-agents.component';

describe('SalesAgentsComponent', () => {
  let component: SalesAgentsComponent;
  let fixture: ComponentFixture<SalesAgentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesAgentsComponent]
    });
    fixture = TestBed.createComponent(SalesAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
