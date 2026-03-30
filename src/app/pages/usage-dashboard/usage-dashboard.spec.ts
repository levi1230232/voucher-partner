import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageDashboard } from './usage-dashboard';

describe('UsageDashboard', () => {
  let component: UsageDashboard;
  let fixture: ComponentFixture<UsageDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(UsageDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
