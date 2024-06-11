namespace Course
{
    class Program_Linq1
    {
        static void Main_Linq1(string[] args)
        {
            // fonte de dados
            int[] numbers = new int[] { 1, 2, 3, 4, 5, };

            // critério de consulta
            //vc pode usar o var ou IEnumerable - o segundo é opção mais correta
            IEnumerable<int> result = numbers
                .Where(x => x % 2 == 0)
                .Select(x => x * 10);

            // Executa a consulta
            foreach (int number in result) { Console.WriteLine(number); }
        }
    }
}