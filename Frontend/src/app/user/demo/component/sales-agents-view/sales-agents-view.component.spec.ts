import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAgentsViewComponent } from './sales-agents-view.component';

describe('SalesAgentsViewComponent', () => {
  let component: SalesAgentsViewComponent;
  let fixture: ComponentFixture<SalesAgentsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesAgentsViewComponent]
    });
    fixture = TestBed.createComponent(SalesAgentsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
