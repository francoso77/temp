using Contract.Entities;

namespace Contract.Services
{
    class ContractService
    {
        private IOnlinePaymentService OnlinePaymentService;

        public ContractService (IOnlinePaymentService onlinePaymentService)
        {
            OnlinePaymentService = onlinePaymentService;
        }

        public void ProcessContract(Contracts contract, int months)
        {
            double basicQuota = contract.TotalValue / months;
            for (int i = 1; i <= months; i++)
            {
                DateTime date = contract.Date.AddMonths(i);
                double updatedQuota = basicQuota + OnlinePaymentService.Interest(basicQuota, i);
                double fullQuota = updatedQuota + OnlinePaymentService.PaymentFee(updatedQuota);
                contract.AddInstallment(new Installment(date, fullQuota));
            }
        }
    }
}
