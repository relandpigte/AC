using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Accounts.Dto
{
    public class AuthenticatorDto
    {
        public string SharedKey { get; set; }
        public string AuthenticationUri { get; set;}
        public List<string> RecoveryCode { get; set; }
        public string StatusMessage { get; set; }
        public bool Status { get; set; }
    }
}
