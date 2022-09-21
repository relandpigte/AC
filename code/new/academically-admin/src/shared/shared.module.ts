import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { EqualValidator } from './directives/equal-validator.directive';
import { UniqueEmailValidator } from './directives/unique-email-validator.directive';
import { BusyDirective } from './directives/busy.directive';
import { BodyClassDirective } from './directives/body-class.directive';
import { Select2Directive } from './directives/select2.directive';
import { ToggableContentDirective } from './directives/toggable-content.directive';
import { AccordionDirective } from './directives/accordion.directive';
import { LoaderDirective } from './directives/loader.directive';
import { ChartDirective } from './directives/chart.directive';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { LayoutStoreService } from './layout/layout-store.service';
import { AppRouteGuard } from './auth/auth-route-guard';

import { AbpPaginationControlsComponent } from './components/pagination/abp-pagination-controls.component';
import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';
import { AbpModalHeaderComponent } from './components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from './components/modal/abp-modal-footer.component';
import { TableHeaderSortComponent } from './components/table-header-sort/table-header-sort.component';
import { PasswordToggleComponent } from './components/password-toggle/password-toggle.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    LocalizePipe,
    SafeHtmlPipe,
    EqualValidator,
    UniqueEmailValidator,
    BusyDirective,
    BodyClassDirective,
    Select2Directive,
    ToggableContentDirective,
    AccordionDirective,
    LoaderDirective,
    ChartDirective,
    AbpPaginationControlsComponent,
    AbpValidationSummaryComponent,
    AbpModalHeaderComponent,
    AbpModalFooterComponent,
    TableHeaderSortComponent,
    PasswordToggleComponent,
  ],
  exports: [
    BsDatepickerModule,
    LocalizePipe,
    SafeHtmlPipe,
    EqualValidator,
    UniqueEmailValidator,
    BusyDirective,
    BodyClassDirective,
    Select2Directive,
    ToggableContentDirective,
    AccordionDirective,
    LoaderDirective,
    ChartDirective,
    AbpPaginationControlsComponent,
    AbpValidationSummaryComponent,
    AbpModalHeaderComponent,
    AbpModalFooterComponent,
    TableHeaderSortComponent,
    PasswordToggleComponent,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AppSessionService,
        AppUrlService,
        AppAuthService,
        AppRouteGuard,
        LayoutStoreService,
      ]
    };
  }
}
