using System;
using System.Globalization;

namespace Exercicios
{
    public class Produto_Properties
    {
        /*
        //Properties

        private string _nome;
        private double _preco;
        private int _quantidade;

        public Produto()
        {
            _quantidade = 5;
        }

        public Produto(string nome, double preco)
            : this()
        {
            _nome = nome;
            _preco = preco;
        }

        public Produto(string nome, double preco, int quantidade)
            : this(nome, preco)
        {
            _quantidade = quantidade;
        }

        //campo VALUE é para susbstituir o argumento passado
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

        public double Preco
        {
            get { return _preco; }
        }

        public int Quantidade
        {
            get { return _quantidade; }
        }

        public double ValorTotalEmEstoque()
        {
            return _preco * _quantidade;
        }

        public void AdicionarProdutos(int quantidade)
        {
            _quantidade += quantidade;
        }

        public void RemoverProdutos(int quantidade)
        {
            _quantidade -= quantidade;
        }

        public override string ToString()
        {
            return _nome
                + ", R$ "
                + _preco.ToString("F2", CultureInfo.InvariantCulture)
                + ", "
                + _quantidade
                + " unidades, Total: R$ "
                + ValorTotalEmEstoque().ToString("F2", CultureInfo.InvariantCulture);
        }
        */
    }
}
