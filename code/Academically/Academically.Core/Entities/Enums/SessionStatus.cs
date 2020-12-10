using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Academically.Entities.Enums
{
    public enum SessionStatus
    {
        [Description("Created")]
        Created,

        [Description("Pending")]
        Pending,

        [Description("Confirmed")]
        Confirmed
    }
}
