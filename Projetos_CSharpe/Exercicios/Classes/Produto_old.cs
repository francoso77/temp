using System;
using System.Globalization;

namespace Exercicios
{
    public class Produto_old
    {
        //Classe com CONSTRUTOR

        /*public string Nome;
        public double Preco;
        public int Quantidade;

        
        // Obriga a classe começar construindo os dados no momento de instanciar 

        //SOBRECARGA - vc pode criar vários construtores com o mesmo nome, uns com alguns campos
        // ou até mesmo sem nenhum 

        public Produto(string nome, double preco, int quantidade){
            Nome = nome;
            Preco = preco;
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

        
        /*******************************************************************/
        //Classe criada sem o CONSTRUTOR

       /* public string Nome;
        public double Preco;
        public int Quantidade;

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
        }*/
    }
}