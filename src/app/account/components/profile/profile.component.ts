import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import { AvatarComponent } from '../avatar/avatar.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ShippingInformationComponent } from './shipping-information/shipping-information.component';

@Component({
  selector: 'app-profile',
  imports: [
    AvatarComponent,
    PersonalInformationComponent,
    ChangePasswordComponent,
    ShippingInformationComponent,
    NgClass,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent {
  isAccordion1Open: boolean = false;
  isAccordion2Open: boolean = false;
  
  constructor () { }

  toggleAccordion(form: string): void {
    const accordionSection: any = {
      accordion_1: () => { this.isAccordion1Open = !this.isAccordion1Open; },
      accordion_2: () => { this.isAccordion2Open = !this.isAccordion2Open; },
    };

    if (accordionSection[form])
      accordionSection[form]();
  }
}
