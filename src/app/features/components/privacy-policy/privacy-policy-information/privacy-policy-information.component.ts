import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';

@Component({
    selector: 'app-privacy-policy-information',
    imports: [],
    templateUrl: './privacy-policy-information.component.html',
    styleUrl: './privacy-policy-information.component.scss'
})
export class PrivacyPolicyInformationComponent {
  url = environment.url;
}
