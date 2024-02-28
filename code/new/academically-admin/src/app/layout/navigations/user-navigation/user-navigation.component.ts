import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';

@Component({
  selector: 'user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.less'],
})
export class UserNavigationComponent extends AppComponentBase implements OnInit {
  constructor(
    injector: Injector,
    private _authService: AppAuthService,
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  onLogoutClick(): void {
    this._authService.logout();
  }
}
