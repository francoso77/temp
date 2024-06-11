using System;
using System.Globalization;

namespace Exercicios
{
    public class Produto_Encapsulado
    {
        /*
        //Encapsulamento

        private string _nome;
        private double _preco;
        private int _quantidade;

        public Produto(){
            _quantidade = 5;
        }
        
        public Produto(string nome, double preco): this(){
            _nome = nome;
            _preco = preco;
        }
        
        public Produto(string nome, double preco, int quantidade): this (nome, preco) {
            _quantidade = quantidade;
        }
        
        // para ler a variável fora da classe
        public string GetNome(){
            return _nome;
        }

        // para alterar a variável fora da classe
        // void pq não vai ter retorno 
        // teste de validação dentro da classe

        public void SetNome( string nome ){
            if(nome != null && nome.Length > 1){
                _nome = nome;
            };
        }

        public double GetPreco(){
            return _preco;
        }

        public int GetQuantidade(){
            return _quantidade;
        }
        
        public double ValorTotalEmEstoque(){
            
            return _preco * _quantidade;
        }

        public void AdicionarProdutos (int quantidade){
            _quantidade += quantidade;
        }
        
        public void RemoverProdutos (int quantidade){
            _quantidade -= quantidade;
        }
        
        public override string ToString(){
            return _nome
                + ", R$ "
                + _preco.ToString("F2", CultureInfo.InvariantCulture)
                + ", "
                + _quantidade
                + " unidades, Total: R$ "
                + ValorTotalEmEstoque().ToString("F2", CultureInfo.InvariantCulture);
                
        }*/
    }
}