import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicianDashboardComponent } from './clinician-dashboard';

describe('ClinicianDashboard', () => {
  let component: ClinicianDashboardComponent;
  let fixture: ComponentFixture<ClinicianDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicianDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicianDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
