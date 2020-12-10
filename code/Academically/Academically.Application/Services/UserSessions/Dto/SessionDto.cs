using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Entities.Enums;
using Academically.Services.Offers.Dto;

namespace Academically.Services.UserSessions.Dto
{
    [AutoMap(typeof(Session))]
    public class SessionDto : EntityDto<Guid>
    {
        public string TimeZone { get; set; }
        public DateTime SessionDate { get; set; }
        public int Duration { get; set; }
        public Guid TutorOfferId { get; set; }
        public SessionStatus Status { get; set; }

        public GetTutorOfferDto TutorOffer { get; set; }
    }
}
