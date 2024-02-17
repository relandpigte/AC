using Academically.Application.Shared.Dto;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Academically.Application.Shared.Services
{
    public interface IEmailService
    {
        Task SendAsync(string toName, string toEmail, string subject, string body);
        Task SendAsync(string toName, string toEmail, string subject, string body, List<EmailAttachment> attachments, bool isCalenderAttachment);
        MemoryStream GetCalenderIcsFormat(Guid calenderId, string title, string type, DateTime startTime, DateTime endTime);
    }
}
