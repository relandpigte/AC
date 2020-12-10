using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.DomainServices.Timezone
{
    public interface ITimezoneDomainService : IDomainService
    {
        DateTime ConvertToLocal(DateTime? startDate, string timezone);
        DateTime ConvertToUtc(DateTime? startDate, string timezone);
    }
}
