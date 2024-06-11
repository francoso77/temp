using System.Security.AccessControl;
using System;
using System.Globalization;

namespace Exercicios
{
    public class Pensao
    {
        public string Name { get; set; }
        public string Email { get; set; }
    
        public Pensao (string name, string email){
            Name = name;
            Email = email;
        }

        public override string ToString(){
            return Name + ", " + Email;
        }
    }
}
