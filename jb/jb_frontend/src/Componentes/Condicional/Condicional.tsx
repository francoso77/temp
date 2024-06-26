interface PropsInterface {
  children: any
  condicao: boolean
}

export default function Condicional({ children, condicao }: PropsInterface) {

  if (condicao) {
    return (
      <>
        {children}
      </>
    )
  } else {
    return (
      <></>
    )
  }
}