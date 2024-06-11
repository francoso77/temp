using System;

namespace Reservations.Entities.Exceptions
{
    class DomainException: ApplicationException
    {
        public DomainException(string message)
            : base(message)
        { }    
    }
}
 