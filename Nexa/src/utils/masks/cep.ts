export function cepMask(value: string) {

  const n = value.replace(/\D/g, "").slice(0, 8);

  if (n.length <= 5)

    return n;

  return `${n.slice(0, 5)}-${n.slice(5)}`;

}