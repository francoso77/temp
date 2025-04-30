namespace Device.Entities
{
    class Scanner : Devices, IScanner
    {
        //aqui é implementação do DEVICES
        public override void ProcessDoc(string document)
        {
            Console.WriteLine("Scanner processing: " + document);
        }

        //aqui é implementaçaõ do ISCANNER
        public string Scan()
        {
            return "Scanner Scan result";
        }
    }
}
