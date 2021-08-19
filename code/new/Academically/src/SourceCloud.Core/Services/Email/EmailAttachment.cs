using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SourceCloud.Core.Services.Email
{
    public class EmailAttachment
    {
        public string FileName { get; set; }
        public MemoryStream FileData { get; set; }
    }
}
