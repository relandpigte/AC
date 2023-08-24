import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ChatComponent } from './chat.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: WrapperComponent,
      canActivate: [AppRouteGuard],
      canActivateChild: [AppRouteGuard],
      children: [
        {
          path: '',
          component: ChatComponent,
        },
      ]
    }
  ])],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
