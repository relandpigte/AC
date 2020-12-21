using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.DomainServices.Timezone
{
    public interface ITimezoneDomainService : IDomainService
    {
        DateTime ConvertToUtc(DateTime date, string timezoneId = "");
    }
}
