using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.AuditLogs.Dto;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Abp.Auditing;
using Academically.Domain.Enums;

namespace Academically.Services.AuditLogs
{
    public class AuditLogsAppService : AcademicallyAppServiceBase, IAuditLogsAppService
    {
        private readonly IRepository<Academically.Domain.Entities.AuditLogs> _auditLogsRepository;

        public AuditLogsAppService(IRepository<Academically.Domain.Entities.AuditLogs> auditLogsRepository)
        {
            _auditLogsRepository = auditLogsRepository;
        }
        public async Task<IEnumerable<AuditLogsDto>> Get()
        {
            var userId = AbpSession.UserId.Value;
            var auditlogs = await _auditLogsRepository
           .GetAll()
           .Where(e => e.UserId == userId
                && !(e.MethodName.ToLower().Contains("get")
                    || e.MethodName.ToLower().Contains("index")
                    || e.MethodName.ToLower().Contains("cookie"))
                && (e.ServiceName.ToLower().EndsWith("CalendarEventsAppService")
                    || e.ServiceName.ToLower().EndsWith("ProjectOffersAppService")
                    || e.ServiceName.ToLower().EndsWith("ProjectsAppService")
                    || e.ServiceName.ToLower().EndsWith("CourseSectionsAppService")
                    || e.ServiceName.ToLower().EndsWith("CoursesAppService")))
           .OrderByDescending(e => e.ExecutionTime)
           .Take(5)
           .Select(e => ObjectMapper.Map<AuditLogsDto>(e))
           .ToListAsync();

            foreach (var auditlog in auditlogs)
            {
                auditlog.AuditLogsType = GetMethodNameType(auditlog.MethodName);
                auditlog.ServiceName = GetServiceNameType(auditlog.ServiceName);
            }

            return auditlogs;
        }

        public AuditLogsType GetMethodNameType(string methodName)
        {
            switch (methodName)
            {
                case "CreateDuplicate":
                case "Create":
                case "CreateBatch":
                case "CreateAsync":
                    return AuditLogsType.Created;

                case "Authenticate":
                    return AuditLogsType.Authenticated;

                case "Edit":
                case "UpdateCourseSectionParent":
                case "UpdateDetails":
                case "UpdateAsync":
                case "Update":
                    return AuditLogsType.Edited;

                case "CheckEmailUniqueness":
                    return AuditLogsType.Others;

                case "Delete":
                case "DeleteAsync":
                    return AuditLogsType.Deleted;

                case "Accept":
                    return AuditLogsType.Accepted;

                case "Approve":
                    return AuditLogsType.Approved;

                case "Decline":
                    return AuditLogsType.Decline;

                case "Cancel":
                    return AuditLogsType.Cancelled;
                case "Reschedule":
                     return AuditLogsType.Reschedule;

                default:
                    return AuditLogsType.Others;
            }
        }

        public string GetServiceNameType(string serviceName)
        {
            serviceName = serviceName.Split('.').Last();
            serviceName = serviceName.Contains("Controller") ? serviceName.Replace("Controller", "") : serviceName.Replace("AppService", "");
            return serviceName;
        }
    }
}
