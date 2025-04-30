namespace Course.Entities
{
    internal class Clients
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public override bool Equals(object? obj)
        {
            //faz o teste com downCasting 
            if (!(obj is Clients other)) return false;
            return Email.Equals(other.Email);
        }

        public override int GetHashCode()
        {
            return Email.GetHashCode();
        }
    }
}
