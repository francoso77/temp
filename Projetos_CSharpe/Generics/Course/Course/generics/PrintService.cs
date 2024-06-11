using System;
using System.Collections.Generic;

namespace Course.generics
{


    // T o que é o "T" quando vc quer criar uma classe que serva para mais de um tipo (int, string, double)
    // vc usa o tipo <T> na classe e o T nas funçõe e instanciações 
    // inclusive pode ser outra letra se quiser <F> exemplo
    class PrintService<T>
    {
        private T[] Valores = new T[10];
        private int Count = 0;

        public void AddValue(T value)
        {
            if (Count == 10)
            {
                throw new InvalidOperationException("PrintService is full");
            }
            Valores[Count] = value;
            Count++;

        }

        public T First()
        {
            if (Count == 0)
            {
                throw new InvalidOperationException("PrintService is empty");
            }
            return Valores[0];
        }

        public void Print()
        {
            Console.Write("[");
            for (int i = 0; i < Count - 1; i++)
            {
                Console.Write(Valores[i] + ", ");
            }
            if (Count > 0)
            {
                Console.Write(Valores[Count - 1] + "]");
            }
        }
    }
}
