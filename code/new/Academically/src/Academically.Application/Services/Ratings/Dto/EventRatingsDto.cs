using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;

namespace Academically.Services.Ratings.Dto;

[AutoMap(typeof(EventRating))]
public class EventRatingsDto
{
    public Guid EventId { get; set; }
    public string Comments { get; set; }
    public int Rating { get; set; }
    public UserDto Reviewer { get; set; }
}