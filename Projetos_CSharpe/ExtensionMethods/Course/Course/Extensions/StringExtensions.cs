namespace System
{
    static class StringExtensions
    {
     
        //cuidado com o RETURN
        public static string Cut(this string thisObj, int count) 
        {  
            if (thisObj != null && thisObj.Length > count) 
            {
                return thisObj.Substring(0, count) + "...";
            }
            return thisObj;
        }
    }
}
