using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Ratings.Dto;

[AutoMap(typeof(EventRating))]
public class CreateEventRatingsDto
{
    public Guid EventId { get; set; }
    public string Comments { get; set; }
    public int Rating { get; set; }
}