namespace Device.Entities
{
    abstract class Devices
    {
        public int SerialNumber { get; set; }
        public abstract void ProcessDoc(string document);
    }
}
