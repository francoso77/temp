export function cpfMask(value: string) {

  const n = value.replace(/\D/g, "").slice(0, 11);

  if (n.length <= 3)

    return n;

  if (n.length <= 6)

    return `${n.slice(0, 3)}.${n.slice(3)}`;

  if (n.length <= 9)

    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;

  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;

}