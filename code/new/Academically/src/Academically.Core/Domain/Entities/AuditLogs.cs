using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("abpauditlogs")]

    public class AuditLogs : Entity
    {
        public DateTime ExecutionTime { get; set; }
        public long? ImpersonatorUserId { get; set; }
        public string Exception { get; set; }
        public string BrowserInfo { get; set; }
        public string ClientName { get; set; }
        public string ClientIpAddress { get; set; }
        public int ExecutionDuration { get; set; }
        public string ReturnValue { get; set; }
        public int? TenantId { get; set; }
        public string MethodName { get; set; }
        public string ServiceName { get; set; }
        public long? UserId { get; set; }
        public int? ImpersonatorTenantId { get; set; }
        public string Parameters { get; set; }
        public string CustomData { get; set; }
    }
}
