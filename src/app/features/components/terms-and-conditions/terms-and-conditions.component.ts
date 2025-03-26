import { Component } from '@angular/core';
import { TermsAndConditionsInformationComponent } from './terms-and-conditions-information/terms-and-conditions-information.component';

@Component({
    selector: 'app-terms-and-conditions',
    imports: [
        TermsAndConditionsInformationComponent,
    ],
    templateUrl: './terms-and-conditions.component.html',
    styleUrl: './terms-and-conditions.component.scss'
})
export default class TermsAndConditionsComponent {

}
