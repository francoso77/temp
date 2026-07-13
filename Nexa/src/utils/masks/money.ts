export function moneyMask(value: string): string {

  const numbers = value.replace(/\D/g, "");

  const amount = Number(numbers) / 100;

  return amount.toLocaleString("pt-BR", {

    style: "currency",

    currency: "BRL",

  });

}