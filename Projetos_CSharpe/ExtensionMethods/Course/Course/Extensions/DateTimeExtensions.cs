using System.Globalization;

namespace System
{
    static class DateTimeExtensions
    {
        //classica STATIC - e os metodos são STATIC tb
        //depedendo do seu tipo de retorno
        

        //para fazer a extensão use a palavra THIS o tipo informado no paramentro DateTime
        public static string ElapsedTime(this DateTime thisObj) 
        {
            //calculos com data use o TimeSpan
            
            TimeSpan duration = DateTime.Now.Subtract(thisObj);

            if (duration.TotalHours < 24) 
            { 
                return duration.TotalHours.ToString("F1", CultureInfo.InvariantCulture) + " hours";
            }
            else
            {
                return duration.TotalDays.ToString("F1", CultureInfo.InvariantCulture) + " days";
            }
        }
    }
}
