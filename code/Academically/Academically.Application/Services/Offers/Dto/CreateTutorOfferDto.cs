using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Offers.Dto
{
    public class CreateTutorOfferDto
    {
        public Guid TutorialId { get; set; }
        public long StudentId { get; set; }
        public bool IsSubmitted { get; set; }
    }
}
