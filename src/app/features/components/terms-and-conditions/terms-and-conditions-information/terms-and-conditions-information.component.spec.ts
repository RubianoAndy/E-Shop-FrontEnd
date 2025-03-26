import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsInformationComponent } from './terms-and-conditions-information.component';

describe('TermsAndConditionsInformationComponent', () => {
  let component: TermsAndConditionsInformationComponent;
  let fixture: ComponentFixture<TermsAndConditionsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsAndConditionsInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
