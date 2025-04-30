namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            DateTime dt = new DateTime(2023, 03, 13, 5, 23, 00);
            
            //classe extendida ... não coloca nada na hora de chamar a função
            Console.WriteLine(dt.ElapsedTime());


            string s1 = "Good morning dear students";
            Console.WriteLine(s1.Cut(10));
            
        }
    }
}