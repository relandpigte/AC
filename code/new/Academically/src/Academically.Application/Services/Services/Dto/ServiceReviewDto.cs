using System;
using System.ComponentModel.DataAnnotations.Schema;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using AutoMapper;

namespace Academically.Services.Services.Dto;

[AutoMap(typeof(ServiceReview))]
public class ServiceReviewDto
{
    public Guid Id { get; set; }
    public Guid ReferenceId { get; set; }
    public int Rating { get; set; }
    public string Comments { get; set; }
    public long ServiceOwnerId { get; set; }
    public ServicesType ServiceType { get; set; }
    public DateTime CreationTime { get; set; }
    public UserDto CreatorUser { get; set; }

    [NotMapped]
    public bool IsFromNotification { get; set; }
}