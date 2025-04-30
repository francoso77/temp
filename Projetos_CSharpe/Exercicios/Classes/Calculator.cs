using System;

namespace Exercicios
{
    public class Calculator
    {
        /*
        //com sobrecarga

        public static int Sum(int n1, int n2)
        {
            return n1 + n2;
        }

        public static int Sum(int n1, int n2, int n3)
        {
            return n1 + n2 + n3;
        }

        public static int Sum(int n1, int n2, int n3, int n4)
        {
            return n1 + n2 + n3 + n4;
        }
        

        //Usando Vetor para calcular os valores passados

        public static int Sum (int[] numeros) {

            int sum = 0;
            for (int i = 0; i < numeros.Length; i++){
                sum += numeros[i];
            }
            return sum;
        }
        */

        //Usando Vetor com PARAMS

        public static int Sum (params int[] numeros) {

            int sum = 0;
            for (int i = 0; i < numeros.Length; i++){
                sum += numeros[i];
            }
            return sum;
        }

        //Usando sem o REF - Assim está errado!!***************
        public static void Triplicar( int x){
                x = x * 3;
        }

        //Usando o REF de forma correta
        public static void TriplicarRef( ref int x){
                x = x * 3;
        }

        //Usando o OUT 
        public static void TriplicarOut( int origem, out int resultado){
                resultado = origem  * 3;
        }

    }
}
