import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from 'abp-ng2-module';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        ApiServiceProxies.RegistrationsServiceProxy,
        ApiServiceProxies.ProfilesServiceProxy,
        ApiServiceProxies.UniversitiesServiceProxy,
        ApiServiceProxies.UserEducationsServiceProxy,
        ApiServiceProxies.EducationLevelsServiceProxy,
        ApiServiceProxies.PhoneVerificationsServiceProxy,
        ApiServiceProxies.RatingsServiceProxy,
        ApiServiceProxies.UserQualificationsServiceProxy,
        ApiServiceProxies.DocumentsServiceProxy,
        ApiServiceProxies.PassportVerificationsServiceProxy,
        ApiServiceProxies.DisciplineTaxonomiesServiceProxy,
        ApiServiceProxies.UserResearchInterestsServiceProxy,
        ApiServiceProxies.ResearchMethodsServiceProxy,
        ApiServiceProxies.UserResearchMethodologiesServiceProxy,
        ApiServiceProxies.UserPublicationsServiceProxy,
        ApiServiceProxies.TestDataGeneratorServiceProxy,
        ApiServiceProxies.ServicesServiceProxy,
        ApiServiceProxies.UserServicesServiceProxy,
        ApiServiceProxies.TimeZonesServiceProxy,
        ApiServiceProxies.SubjectsServiceProxy,
        ApiServiceProxies.TutorWizardServiceProxy,
        ApiServiceProxies.SpokenLanguagesServiceProxy,
        ApiServiceProxies.UserSpokenlanguageServiceProxy,
        ApiServiceProxies.PaymentsServiceProxy,
        ApiServiceProxies.PhotoIdVerificationsServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
