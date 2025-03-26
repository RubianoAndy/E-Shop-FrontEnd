import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';

@Component({
    selector: 'app-terms-and-conditions-information',
    imports: [],
    templateUrl: './terms-and-conditions-information.component.html',
    styleUrl: './terms-and-conditions-information.component.scss'
})
export class TermsAndConditionsInformationComponent {
  url = environment.url;
}
