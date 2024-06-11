using System;
using System.Globalization;

namespace Exercicios
{
    public class NovoProduto
    {
        //Usando o THIS

        public string Nome;
        public double Preco;
        public int Quantidade;

        public NovoProduto(){
            Quantidade = 10;
        }
        
        public NovoProduto(string nome, double preco): this(){
            Nome = nome;
            Preco = preco;
        }
        
        //assim eu aproveito o codigo já escrito em outa construção
        //detalhe para variaveis com nome iguais vc precisa usar o this antes do nome
        //exempli   this.nome = nome
        // o primeiro campo é o da construção e o segundo é um argumento.
        // vc pode tb passar o this como argumento.. como chamando ele mesmo
        
        public NovoProduto(string nome, double preco, int quantidade): this (nome, preco) {
            Quantidade = quantidade;
        }
        
        public double ValorTotalEmEstoque(){
            
            return Preco * Quantidade;
        }

        public void AdicionarProdutos (int quantidade){
            Quantidade += quantidade;
        }
        
        public void RemoverProdutos (int quantidade){
            Quantidade -= quantidade;
        }
        
        public override string ToString(){
            return Nome
                + ", R$ "
                + Preco.ToString("F2", CultureInfo.InvariantCulture)
                + ", "
                + Quantidade
                + " unidades, Total: R$ "
                + ValorTotalEmEstoque().ToString("F2", CultureInfo.InvariantCulture);
        }

    }
}