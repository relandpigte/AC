using Abp.Dependency;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Emails
{
    public class EmailTemplateHelper : ITransientDependency
    {
        private string templatesPath;

        public EmailTemplateHelper(IWebHostEnvironment env)
        {
            templatesPath = Path.Combine(env.WebRootPath, "templates", "email");
        }

        public async Task<string> GetTemplate(string templateName, IEnumerable<KeyValuePair<string, string>> keyValuePairs)
        { 
            var fullTemplatePath = Path.Combine(templatesPath, templateName);
            using (var reader = File.OpenText(fullTemplatePath))
            {
                string template = await reader.ReadToEndAsync();
                if (keyValuePairs != null && keyValuePairs.Any())
                {
                    foreach (var keyValuePair in keyValuePairs)
                    {
                         template = template.Replace($"{{{keyValuePair.Key}}}", keyValuePair.Value);
                    }
                }
                return template;
            }
        }
    }
}
