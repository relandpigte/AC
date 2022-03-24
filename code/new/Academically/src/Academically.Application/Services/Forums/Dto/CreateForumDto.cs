using System.Collections.Generic;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Forums.Dto
{
    [AutoMapTo(typeof(Forum))]
	public class CreateForumDto
	{
        public string Message { get; set; }

        public IEnumerable<CreateForumTopicDto> Topics { get; set; }
    }
}

