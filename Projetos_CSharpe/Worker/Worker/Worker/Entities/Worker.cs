using Workers.Entities.Enums;
using System.Collections.Generic;

namespace Workers.Entities
{
    class Worker
    {
        public string Name { get; set; }
        public WorkerLevel Level { get; set; }
        public double BaseSalary { get; set; }
        public Department Department { get; set; }
        //cria uma lista instanciada para que ela não seja nula
        public List<HourContract> Contracts { get; set; } = new List<HourContract>();

        public Worker() { }
        //qdo tem uma composição com objetos lista não se passa ela no constructor
        public Worker(string name, WorkerLevel level, double baseSalary, Department department)
        {
            Name = name;
            Level = level;
            BaseSalary = baseSalary;
            Department = department;
        }

        public void AddContract(HourContract contract)
        {
            Contracts.Add(contract);
        }
        public void RemoveContract(HourContract contract) 
        {  
            Contracts.Remove(contract);
        }
        public double Income (int year, int month)
        {
            double sum = BaseSalary;
            foreach (HourContract contract in Contracts)
            {
                if(contract.Date.Month == month && contract.Date.Year == year)
                {
                    sum += contract.TotalValue();
                }
            }
            return sum;
        }
    }
}
