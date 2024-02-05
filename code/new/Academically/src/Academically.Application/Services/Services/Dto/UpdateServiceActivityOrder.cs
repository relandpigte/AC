using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Services.Dto;

[AutoMapTo(typeof(ServiceActivity))]
public class UpdateServiceActivityOrder : EntityDto<Guid>
{
    public int DisplayOrder { get; set; }
}