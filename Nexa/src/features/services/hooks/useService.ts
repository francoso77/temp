import { useServices } from "./useServices";

export function useService(
  id: string
) {

  const context =
    useServices();

  const service =
    context.services.find(
      item => item.id === id
    );

  return {

    service,

    ...context,

  };

}