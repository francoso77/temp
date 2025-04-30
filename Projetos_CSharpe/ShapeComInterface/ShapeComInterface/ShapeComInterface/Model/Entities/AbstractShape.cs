using ShapeComInterface.Model.Enums;

namespace ShapeComInterface.Model.Entities
{
    //aqui instancio a interface é a mesma coisa da anterior porém com referÊncia de interface
    abstract class AbstractShape : IShape
    {
        public Color Color { get; set; }

        public abstract double Area();
    }
}
