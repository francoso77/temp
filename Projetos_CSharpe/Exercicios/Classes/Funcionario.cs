using System;
using System.Globalization;
namespace Exercicios
{
    public class Funcionario
    {
        public string Nome;
        public double SalarioBruto;
        public double Imposto;


        public double SalarioLiquido(){
            return SalarioBruto -= Imposto;
        }

        public void AumentarSalario(double porcentagem){
            if (porcentagem > 0 ){
                SalarioBruto += Imposto;
                SalarioBruto = SalarioBruto + ((SalarioBruto * porcentagem)/100.00);
            }
            SalarioLiquido();
        }

        public override string ToString(){
            return Nome
                + ", R$ "
                + SalarioBruto.ToString("F2", CultureInfo.InvariantCulture);
        }
    }
}