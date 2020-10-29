import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

import { AbpPaginationControlsComponent } from './components/pagination/abp-pagination-controls.component';
import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';
import { AbpModalHeaderComponent } from './components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from './components/modal/abp-modal-footer.component';
import { LayoutStoreService } from './layout/layout-store.service';

import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';
import { BodyClassDirective } from './directives/body-class.directive';
import { TableHeaderSortComponent } from './components/table-header-sort/table-header-sort.component';
import { ChartDirective } from './directives/chart.directive';

@NgModule({
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  declarations: [
    EqualValidator,
    BusyDirective,
    BodyClassDirective,
    AbpPaginationControlsComponent,
    AbpValidationSummaryComponent,
    AbpModalHeaderComponent,
    AbpModalFooterComponent,
    LocalizePipe,
    TableHeaderSortComponent,
    ChartDirective,
  ],
  exports: [
    EqualValidator,
    BusyDirective,
    BodyClassDirective,
    AbpPaginationControlsComponent,
    AbpValidationSummaryComponent,
    AbpModalHeaderComponent,
    AbpModalFooterComponent,
    LocalizePipe,
    TableHeaderSortComponent,
    ChartDirective,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [AppSessionService, AppUrlService, AppAuthService, AppRouteGuard, LayoutStoreService],
    };
  }
}
