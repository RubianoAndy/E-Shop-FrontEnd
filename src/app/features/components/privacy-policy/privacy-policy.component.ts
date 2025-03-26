import { Component } from '@angular/core';
import { PrivacyPolicyInformationComponent } from './privacy-policy-information/privacy-policy-information.component';

@Component({
    selector: 'app-privacy-policy',
    imports: [
        PrivacyPolicyInformationComponent,
    ],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.scss'
})
export default class PrivacyPolicyComponent {

}
