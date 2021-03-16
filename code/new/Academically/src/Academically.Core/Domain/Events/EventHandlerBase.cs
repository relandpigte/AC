using System;
using Abp.Dependency;
using Abp.Localization;

namespace Academically.Domain.Events
{
    public abstract class EventHandlerBase : ITransientDependency
    {
        private readonly ILocalizationManager _localizationManager;
        private string _source;

        public EventHandlerBase(ILocalizationManager localizationManager)
        {
            _localizationManager = localizationManager;
            _source = AcademicallyConsts.LocalizationSourceName;
        }

        protected string L(string name, params object[] args)
        {
            var localizedText = this._localizationManager.GetString(_source, name);
            return string.Format(localizedText, args);
        }
    }
}
