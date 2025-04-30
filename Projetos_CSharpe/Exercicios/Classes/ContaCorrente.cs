using System;
using System.Globalization;

namespace Exercicios
{
    public class ContaCorrente
    {
        //Quando puder ser alteradop é { get; set; } quando não pode é { get; private set; }
        public string Titular { get; set; }
        public int Numero { get; private set; }
        // no caso do saldo a alteração só poderá ser feito por função dentro da classe por iss ela é private set
        public double Saldo { get; private set;}
              
        //Construtores

        public ContaCorrente ( string titular, int numero) {
            Titular = titular;
            Numero = numero;
        }

        
        //atenção como o saldo é alterando atrás de função ... qdo instanciarmos o saldo em outra parte do sistema
        //fica melhor para manutenção o construtor chamar uma função para fazer está operação
        
        public ContaCorrente ( string titular, int numero, double depositoInicial) : this (titular, numero) {
            Deposito(depositoInicial);
        }

        public void Deposito(double vrDepositado)
        {
            Saldo += vrDepositado;
        }

        public void Saque(double vrSacado)
        {
            Saldo -= (vrSacado + 5.0);
        }

        public override string ToString()
        {
            return "Conta "
                + Numero
                + ", Titular: "
                + Titular
                + ", Saldo: R$"
                + Saldo.ToString("F2", CultureInfo.InvariantCulture);
        }
    }
}
