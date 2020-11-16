using Abp.Application.Services;
using Academically.Services.Offers.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Offers
{
    public interface ITutorOffersAppService : IApplicationService
    {
        Task CreateAsync(CreateTutorOfferDto inputs);
    }
}
