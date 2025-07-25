import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-auth0-auth-button',
    templateUrl: 'auth0-auth-button.html',
    imports: [CommonModule],
    standalone: true
})
export class Auth0AuthButtonComponent {
    constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) { }
}