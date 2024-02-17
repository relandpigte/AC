using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Academically.Domain.Entities;
using Academically.Services.Coachings.Dto;
using Microsoft.AspNetCore.Mvc;

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
        Task<ServicePurchaseDto> GetPurchasedByReference(Guid referenceId);
        Task<IEnumerable<ServicePurchaseDto>> GetAllPurchases(Guid? referenceId, long? userId);
        Task<ServicePurchaseDto> SavePurchase(CreateServicePurchaseDto input);
        Task<ServiceBookingDto> SaveBooking(CreateServiceBookingDto input);
        Task<ServiceBookingDto> CancelBooking(CancelServiceBookingDto input);
        Task<IEnumerable<ServiceBookingDto>> GetAllBookings(Guid? referenceId, long? ownerId);
        Task<ServiceBookingDto> GetBookingAsync(Guid bookingId);
        Task<ServiceBookingDto> GetBookingByReferenceId(Guid referenceId);
        Task<ServiceBookingDto> GetBookingDetails(Guid referenceId, long userId);

        // service offers
        Task<ServiceOfferDto> UpsertServiceOffer(CreateServiceOfferDto input);
        Task<IEnumerable<ServiceOfferDto>> GetServiceOffers(Guid referenceId, ServiceOfferStatus? status, bool? isPurchased);
        Task<ServiceOfferDto> GetServiceOffer(Guid Id);
        Task<ServiceOfferDto> LaunchOffer(Guid Id);
        Task<ServiceOfferDto> CloseOffer(Guid Id);
        
        // Service reviews
        Task<IEnumerable<ServiceReviewDto>> GetServiceReviews(Guid referenceId, Guid? notificationId);
        Task<ServiceReview> SaveServiceReview(CreateServiceReviewDto input);
        Task<ServiceReviewDto> GetUserReview(Guid referenceId);
        Task<ServiceReviewStats> GetServiceReviewStats(Guid referenceId);

        // Service flags
        Task<ServiceFeatureFlagDto> SaveFeatureFlags(ServiceFeatureFlagDto input);
        Task<ServiceFeatureFlagDto> GetFeatureFlags(Guid referenceId);
        
        // Service activities
        Task<IEnumerable<ServiceActivityDto>> GetActivities(Guid serviceId);
        Task<ServiceActivityDto> GetActivity(Guid id);
        Task<ServiceActivityDto> SaveActivity(CreateServiceActivityDto input);
        Task UpdateServiceActivityOrder(UpdateServiceActivityOrder[] input);
        
        // Service Presentations
        Task SaveServicePresentationAsync([FromForm] CreateServicePresentationsDto input);
        Task<IEnumerable<ServicePresentationDto>> GetAllServicePresentationAsync(Guid referenceId);
        
        // Service Handouts
        Task SaveServiceHandoutAsync([FromForm] CreateServiceHandoutsDto input);
        Task<IEnumerable<ServiceHandoutDto>> GetAllServiceHandoutsAsync(Guid referenceId);
    }
}
