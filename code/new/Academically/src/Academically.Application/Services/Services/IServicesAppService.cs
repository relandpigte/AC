using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.Services
{
    public interface IServicesAppService : IApplicationService
    {
        Task<IEnumerable<ServiceDto>> GetCategories();
        Task<IEnumerable<ServiceDto>> GetServices(Guid categoryId);
        Task<IEnumerable<ServiceMappingDto>> GetLevels(Guid categoryId, Guid serviceId);
        Task<IEnumerable<SubjectDto>> GetSubjects(string levelName);

        // using services2 table
        Task<IEnumerable<Service2Dto>> GetAllCategories();
        IEnumerable<Service2Dto> GetStaticServiceLevels();
        IEnumerable<Service2Dto> GetStaticServices();

        // services
        Task<ServicePurchaseDto> GetPurchase(Guid id);
        Task<IEnumerable<ServicePurchaseDto>> GetAllPurchases(Guid referenceId, long? userId);
        Task<ServicePurchaseDto> SavePurchase(CreateServicePurchaseDto input);


        // service offers
        Task<ServiceOfferDto> UpsertServiceOffer(CreateServiceOfferDto input);
        Task<IEnumerable<ServiceOfferDto>> GetServiceOffers(Guid referenceId, ServiceOfferStatus? status, bool? isPurchased);
        Task<ServiceOfferDto> GetServiceOffer(Guid Id);
        Task<ServiceOfferDto> LaunchOffer(Guid Id);
        Task<ServiceOfferDto> CloseOffer(Guid Id);
    }
}
