namespace Course.Entities
{
    //struct não é classe é um tipo valor
    struct Point
    {
        public int X {  get; set; }
        public int Y { get; set; }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }
    }
}
