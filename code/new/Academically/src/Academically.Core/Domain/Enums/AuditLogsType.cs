using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Domain.Enums
{
    public enum AuditLogsType
    {
        Authenticated,
        Created,
        Edited,
        Deleted,
        Others,
        Accepted,
        Approved,
        Decline,
        Cancelled
    }
}
