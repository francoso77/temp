export function formatDuration(
  minutes: number
) {

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const remaining =
    minutes % 60;

  if (!remaining) {
    return `${hours}h`;
  }

  return `${hours}h ${remaining}min`;

}