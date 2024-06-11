using ShapeComInterface.Model.Enums;

namespace ShapeComInterface.Model.Entities
{
    abstract class Shape
    {
        public Color Color { get; set; }
        public abstract double Area();
    }
}
