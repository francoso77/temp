export function cnpjMask(value: string) {

  const n = value.replace(/\D/g, "").slice(0, 14);

  if (n.length <= 2) return n;

  if (n.length <= 5)

    return `${n.slice(0, 2)}.${n.slice(2)}`;

  if (n.length <= 8)

    return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`;

  if (n.length <= 12)

    return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8)}`;

  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12)}`;

}