export function formatBoolean(
  value: boolean,
  yes = "Sim",
  no = "Não"
) {
  return value ? yes : no;
}