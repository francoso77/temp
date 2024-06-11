using System;
using System.Globalization;

namespace Exercicios
{
    public class Produto
    {
        //Properties

        //propriedade privativas
        private string _nome;

        //propriedades auto implementadas get e set
        public double Preco { get; private set; }
        public int Quantidade { get; private set; }
        
        public Produto()
        {
            Quantidade = 5;
        }

        public Produto(string nome, double preco)
            : this()
        {
            _nome = nome;
            Preco = preco;
        }

        public Produto(string nome, double preco, int quantidade)
            : this(nome, preco)
        {
            Quantidade = quantidade;
        }

        //campo VALUE é para susbstituir o argumento passado
        // get e set implementados manualmente devido a ter código na sua utilização como o teste do campo
        //propriedades customizadas
        
        public string Nome
        {
            get { return _nome; }
            set
            {
                if (value != null && value.Length > 1)
                {
                    _nome = value;
                }
            }
        }

        public double ValorTotalEmEstoque()
        {
            return Preco * Quantidade;
        }

        public void AdicionarProdutos(int quantidade)
        {
            Quantidade += quantidade;
        }

        public void RemoverProdutos(int quantidade)
        {
            Quantidade -= quantidade;
        }

        public override string ToString()
        {
            return _nome
                + ", R$ "
                + Preco.ToString("F2", CultureInfo.InvariantCulture)
                + ", "
                + Quantidade
                + " unidades, Total: R$ "
                + ValorTotalEmEstoque().ToString("F2", CultureInfo.InvariantCulture);
        }
    }
}
