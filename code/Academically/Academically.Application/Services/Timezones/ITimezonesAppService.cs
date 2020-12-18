using Abp.Application.Services;
using Academically.Services.Timezones.Dto;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Academically.Services.Timezones
{
    public interface ITimezonesAppService : IApplicationService
    {
        IEnumerable<TimezoneInfoDto> GetTimezonesList();
        TimezoneInfoDto GetTimezoneInfo(string timezoneId);
    }
}
