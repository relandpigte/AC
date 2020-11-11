using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserProfiles.Dto
{
    [AutoMap(typeof(UserSupportServiceSessionRate))]
    public class UserSupportServiceSessionRateDto : EntityDto<Guid>
    {
        public Guid UserSupportServiceId { get; set; }
        public decimal SingleSessionRate { get; set; }
        public decimal MultipleSessionRate { get; set; }
        public int MultipleSessionCount { get; set; }
        public bool FreeSession { get; set; }
    }
}
