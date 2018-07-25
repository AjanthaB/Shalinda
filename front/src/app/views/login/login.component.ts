import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  @Input() username: string;
  @Input() password: string;

  constructor(private router: Router) {}

  login() {
    console.log('User: ', this.username, ' Password: ', this.password);
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigateByUrl('/employees');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
