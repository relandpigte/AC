using System;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Videos.Dto
{
	public class UpdateVideoDto
	{
        public Guid Id { get; set; }
        public Guid? DocumentId { get; set; }
    }
}

