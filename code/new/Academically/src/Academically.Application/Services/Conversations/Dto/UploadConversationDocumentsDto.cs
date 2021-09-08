using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Academically.Services.Conversations.Dto
{
    public class UploadConversationDocumentsDto
    {
        public Guid ConversationId { get; set; }
        public IEnumerable<IFormFile> Documents { get; set; }
    }
}
