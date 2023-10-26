using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using AutoMapper;

namespace Academically.Services.Ratings.Dto;

[AutoMap(typeof(ServiceRating))]
public class ServiceRatingDto: EntityDto<Guid>
{
    public Guid ServiceId { get; set; }
    public RatingExperienceType ExperienceType { get; set; }
    public string Comments { get; set; }
    public DateTime CreationTime { get; set; }
    public UserDto CreatorUser { get; set; }
    
    [NotMapped]
    public decimal TotalRatingPercentage { get; set; }
}