import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherDashboardComponent } from './researcher-dashboard';

describe('ResearcherDashboard', () => {
  let component: ResearcherDashboardComponent;
  let fixture: ComponentFixture<ResearcherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearcherDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearcherDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
