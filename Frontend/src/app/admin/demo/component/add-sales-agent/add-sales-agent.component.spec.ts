import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesAgentComponent } from './add-sales-agent.component';

describe('AddSalesAgentComponent', () => {
  let component: AddSalesAgentComponent;
  let fixture: ComponentFixture<AddSalesAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesAgentComponent]
    });
    fixture = TestBed.createComponent(AddSalesAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
