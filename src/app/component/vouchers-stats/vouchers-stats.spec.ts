import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersStats } from './vouchers-stats';

describe('VouchersStats', () => {
  let component: VouchersStats;
  let fixture: ComponentFixture<VouchersStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VouchersStats],
    }).compileComponents();

    fixture = TestBed.createComponent(VouchersStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
