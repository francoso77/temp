using Shapes.Entities.Enums;

namespace Shapes.Entities
{
    abstract class Shape
    {
        public Color Color { get; set; }

        //qdo vc tira está opção vc obriga o uso com instanciação
        //public Shape() { }
        public Shape(Color color)
        {
            Color = color;
        }

        public abstract double Area();

 
    }
}
