using System;

namespace Academically.Extensions
{
    public static class IntegerExtensions
    {
        public static decimal ToDecimal(this int num)
        {
            return Convert.ToDecimal(num);
        }
    }
}
