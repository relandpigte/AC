using SourceCloud.Core.Services.Email;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace SourceCloud.Core.Services
{
    public interface IEmailService
    {
        Task SendAsync(string toName, string toEmail, string subject, string body);
        Task SendAsync(string toName, string toEmail, string subject, string body, List<EmailAttachment> attachments);
        MemoryStream GetCalenderIcsFormat(Guid calenderId, string title, string type, DateTime startTime, DateTime endTime);
    }
}
