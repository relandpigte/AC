using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Offers.Dto
{
    [AutoMap(typeof(TutorOffer))]
    public class GetTutorOfferDto : EntityDto<Guid>
    {
        public Guid TutorialId { get; set; }
        public long StudentId { get; set; }
        public bool IsSubmitted { get; set; }
        public string CoverLetter { get; set; }
        public decimal SingleSessionRate { get; set; }
        public decimal MultipleSessionRate { get; set; }
        public int MultipleSessionCount { get; set; }
    }
}
