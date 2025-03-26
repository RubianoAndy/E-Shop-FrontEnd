import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyInformationComponent } from './privacy-policy-information.component';

describe('PrivacyPolicyInformationComponent', () => {
  let component: PrivacyPolicyInformationComponent;
  let fixture: ComponentFixture<PrivacyPolicyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
