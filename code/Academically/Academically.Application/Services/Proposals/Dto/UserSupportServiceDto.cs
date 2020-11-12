using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Services.SupportServices.Dto;
using Academically.Services.UserProfiles.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Proposals.Dto
{
    [AutoMapFrom(typeof(UserSupportService))]
    public class UserSupportServiceDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public Guid SupportServiceId { get; set; }
        public SupportServiceDto SupportService { get; set; }
        public UserSupportServiceSessionRateDto UserSupportServiceSessionRate { get; set; }
    }
}
