using System.Globalization;

namespace ShapeComInterface.Model.Entities
{
    class Circle : AbstractShape
    {
        //lebrando aqui q ele vai herdar a propriedade COLOR de shape
        public double Radius { get; set; }

        public override double Area()
        {
            return Math.PI * Radius * Radius;
        }

        //aqui para converter a tipo Circle em string e imprimir no console de forma personalizada 
        public override string ToString()
        {
            return "Circule color = "
                + Color
                + ", radius = "
                + Radius.ToString("F2", CultureInfo.InvariantCulture)
                + ", area = "
                + Area().ToString("F2", CultureInfo.InvariantCulture);
        }
    }
}
