using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using Academically.Entities.Enums;

namespace Academically.Extensions
{
    public static class EnumExtensions
    {
        public static List<EnumItem> ToList<TEnum>() where TEnum : struct
        {
            var items = Enum.GetValues(typeof(TEnum))
               .Cast<TEnum>()
               .Select(v => new EnumItem()
               {
                   Text = v.ToString(),
                   Value = Convert.ToInt32(v),
               })
               .ToList();

            return items;
        }
    }
}
