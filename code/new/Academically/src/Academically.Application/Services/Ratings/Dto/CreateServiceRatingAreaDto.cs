using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Ratings.Dto
{
    [AutoMapTo(typeof(ServiceRatingArea))]
    public class CreateServiceRatingAreaDto
    {
        public RatingAreaType AreaType { get; set; }
        public int Rating { get; set; }
    }
}

