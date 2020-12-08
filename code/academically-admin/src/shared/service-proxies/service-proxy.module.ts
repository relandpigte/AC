import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from 'abp-ng2-module';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.ProposalsServiceProxy,
    ApiServiceProxies.SupportServicesServiceProxy,
    ApiServiceProxies.ResearchMethodsServiceProxy,
    ApiServiceProxies.DisciplineTaxonomiesServiceProxy,
    ApiServiceProxies.UserEducationsServiceProxy,
    ApiServiceProxies.WidgetsServiceProxy,
    ApiServiceProxies.UserProfilesServiceProxy,
    ApiServiceProxies.RegistrationsServiceProxy,
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.ConfigurationServiceProxy,
    ApiServiceProxies.UserPublicationsServiceProxy,
    ApiServiceProxies.AddressLookupServiceProxy,
    ApiServiceProxies.UserTutorialsServiceProxy,
    ApiServiceProxies.DisciplineTaxonomyStudyLevelsServiceProxy,
    ApiServiceProxies.TutorOffersServiceProxy,
    ApiServiceProxies.PasswordResetsServiceProxy,
    ApiServiceProxies.UserSessionsServiceProxy,
    { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
  ]
})
export class ServiceProxyModule {}
