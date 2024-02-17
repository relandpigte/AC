using Academically.Application.Shared.Configurations;
using Academically.Application.Shared.Dto;
using Academically.Application.Shared.Services;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Aws.Services
{
    public class SESService : IEmailService, IDisposable
    {
        private readonly IAmazonSimpleEmailService _client;

        private string fromName;
        private string fromEmail;

        public SESService(EmailConfiguration configuration, IConfiguration awsConfiguration)
        {
            fromName = configuration.FromName;
            fromEmail = configuration.FromEmail;
            var options = awsConfiguration.GetAWSOptions();
            _client = options.CreateServiceClient<IAmazonSimpleEmailService>();
        }

        public async Task SendAsync(string toName, string toEmail, string subject, string body)
        {
            var mailMessage = new MailMessage();
            mailMessage.Sender = new MailAddress(fromEmail, fromName);
            mailMessage.From = new MailAddress(fromEmail, fromName);
            mailMessage.To.Add(new MailAddress(toEmail, toName));
            mailMessage.Subject = subject;
            mailMessage.Body = body;
            mailMessage.BodyEncoding = Encoding.UTF8;
            mailMessage.IsBodyHtml = true;
            await _client.SendRawEmailAsync(
                new SendRawEmailRequest
                {
                    RawMessage = new RawMessage
                    {
                        Data = MailMessageToStream(mailMessage)
                    }
                }
            );
        }

        public async Task SendAsync(string toName, string toEmail, string subject, string body, List<EmailAttachment> attachments, bool isCalenderAttachment = false)
        {
            var mailMessage = new MailMessage();
            mailMessage.Sender = new MailAddress(fromEmail, fromName);
            mailMessage.From = new MailAddress(fromEmail, fromName);
            mailMessage.To.Add(new MailAddress(toEmail, toName));
            mailMessage.Subject = subject;
            mailMessage.Body = body;
            mailMessage.BodyEncoding = Encoding.UTF8;
            mailMessage.IsBodyHtml = true;
            foreach(var attachment in attachments)
            {
                if (isCalenderAttachment)
                {
                    System.Net.Mail.Attachment attach = new System.Net.Mail.Attachment(attachment.FileData, attachment.FileMimeType);
                    mailMessage.Attachments.Add(attach);
                }
                else
                {
                    System.Net.Mail.Attachment attach = new System.Net.Mail.Attachment(attachment.FileData, attachment.FileName);
                    mailMessage.Attachments.Add(attach);
                }
            }
            await _client.SendRawEmailAsync(
                new SendRawEmailRequest
                {
                    RawMessage = new RawMessage
                    {
                        Data = MailMessageToStream(mailMessage)
                    }
                }
            );
          
        }

        public void Dispose()
        {
            if (_client != null)
                _client.Dispose();
        }

        private MemoryStream MailMessageToStream(MailMessage message)
        {
            var mStream = new MemoryStream();

            var assembly = typeof(SmtpClient).Assembly;
            var mailWriterType = assembly.GetType("System.Net.Mail.MailWriter");

            var fileStream = new MemoryStream();

            var mailWriterContructor = mailWriterType.GetConstructor(BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { typeof(Stream), typeof(bool) }, null);
            var mailWriter = mailWriterContructor.Invoke(new object[] { fileStream, true });

            var sendMethod = typeof(MailMessage).GetMethod("Send", BindingFlags.Instance | BindingFlags.NonPublic);
            sendMethod.Invoke(message, BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { mailWriter, true, true }, null);

            var closeMethod = mailWriter.GetType().GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic);
            fileStream.WriteTo(mStream);
            closeMethod.Invoke(mailWriter, BindingFlags.Instance | BindingFlags.NonPublic, null, new object[] { }, null);

            return mStream;
        }

        public MemoryStream GetCalenderIcsFormat(Guid calenderId, string title, string type, DateTime startTime, DateTime endTime)
        {
            StringBuilder strCalFormat = new StringBuilder();
            strCalFormat.AppendLine("BEGIN:VCALENDAR");
            strCalFormat.AppendLine("VERSION:2.0");
            strCalFormat.AppendLine("PRODID:-//Schedule a Meeting");
            strCalFormat.AppendLine("X-WR-RELCALID:ABC");

            if (type.Equals("Cancelled"))
            {
                strCalFormat.AppendLine("METHOD:CANCEL");
            }
            else
            {
                strCalFormat.AppendLine("METHOD:REQUEST");
            }
            
            strCalFormat.AppendLine("BEGIN:VEVENT");
            strCalFormat.AppendLine("UID:" + calenderId);
            strCalFormat.AppendLine(type.Equals("Cancelled") ? "SEQUENCE:2" : "SEQUENCE:0");
            strCalFormat.AppendLine(string.Format("SUMMARY:{0}", (type.Equals("Cancelled"))? $"Cancelled: {title}" : title));
            strCalFormat.AppendLine("CLASS:PUBLIC");
            strCalFormat.AppendLine("TRANSP:TRANSPARENT");
            strCalFormat.AppendLine(string.Format("DTSTART:{0:yyyyMMddTHHmmssZ}", startTime));
            strCalFormat.AppendLine(string.Format("DTSTAMP:{0:yyyyMMddTHHmmssZ}", startTime));
            strCalFormat.AppendLine(string.Format("DTEND:{0:yyyyMMddTHHmmssZ}", endTime));

            if (type.Equals("Cancelled"))
            {
                strCalFormat.AppendLine("STATUS:CANCELLED");
            }

            strCalFormat.AppendLine("END:VEVENT");
            strCalFormat.AppendLine("END:VCALENDAR");
            byte[] byteArray = Encoding.ASCII.GetBytes(strCalFormat.ToString());
            MemoryStream aStream = new MemoryStream(byteArray);
            return aStream;
        }
    }
}
