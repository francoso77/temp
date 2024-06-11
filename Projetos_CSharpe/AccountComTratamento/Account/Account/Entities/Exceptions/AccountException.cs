using System;

namespace Accounts.Entities.Exceptions
{
    internal class AccountException : ApplicationException
    {
        public AccountException(string message) :base(message) { }
    }
}
