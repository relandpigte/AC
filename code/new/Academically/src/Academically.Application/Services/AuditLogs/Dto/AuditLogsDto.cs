using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
namespace Academically.Services.AuditLogs.Dto
{
    [AutoMapFrom(typeof(Academically.Domain.Entities.AuditLogs))]
    public class AuditLogsDto : EntityDto
    {
        public DateTime ExecutionTime { get; set; }
        public string MethodName { get; set; }
        public string ServiceName { get; set; }
        public long? UserId { get; set; }
        public int? ImpersonatorTenantId { get; set; }
        public string Parameters { get; set; }
        public AuditLogsType AuditLogsType { get; set; }
    }
}
