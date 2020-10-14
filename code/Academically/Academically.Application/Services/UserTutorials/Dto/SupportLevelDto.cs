using Abp.AutoMapper;
using Abp.Domain.Entities;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserTutorials.Dto
{
    [AutoMap(typeof(SupportLevel))]
    public class SupportLevelDto : Entity<int>
    {
        public int Level { get; set; }
    }
}
