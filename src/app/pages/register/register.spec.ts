import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RegisterComponent } from './register';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let navigatedTo: unknown;
  let router: Router;

  beforeEach(async () => {
    navigatedTo = null;
    router = {
      navigate: (commands: unknown[]) => {
        navigatedTo = commands;
        return Promise.resolve(true);
      },
    } as Router;

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [{ provide: Router, useValue: router }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login', () => {
    component.goLogin();

    expect(navigatedTo).toEqual(['/login']);
  });
});
