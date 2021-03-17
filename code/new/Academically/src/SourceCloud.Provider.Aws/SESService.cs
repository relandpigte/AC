using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.Extensions.Configuration;
using SourceCloud.Core.Configurations;
using SourceCloud.Core.Services;
using System;
using System.IO;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SourceCloud.Provider.Aws
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

            var mailWriterContructor = mailWriterType.GetConstructor(BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { typeof(Stream) }, null);
            var mailWriter = mailWriterContructor.Invoke(new object[] { fileStream });

            var sendMethod = typeof(MailMessage).GetMethod("Send", BindingFlags.Instance | BindingFlags.NonPublic);
            sendMethod.Invoke(message, BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { mailWriter, true, true }, null);

            var closeMethod = mailWriter.GetType().GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic);
            fileStream.WriteTo(mStream);
            closeMethod.Invoke(mailWriter, BindingFlags.Instance | BindingFlags.NonPublic, null, new object[] { }, null);

            return mStream;
        }
    }
}
