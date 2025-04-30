using System.Xml.Serialization;
namespace Exercicios
{
    public struct Point
    {
        public double x;
        public double y;

        public override string ToString(){
            return "(" + x + ", " + y + ")";
        }
    }
}