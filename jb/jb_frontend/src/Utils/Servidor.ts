export const URL_BACKEND: string = (
  process.env.REACT_APP_BACKEND_PROTOCOLO as string
).concat(
  process.env.REACT_APP_BACKEND_HOST as string,
  ":",
  process.env.REACT_APP_BACKEND_PORTA as string
)