import { useServices } from "./useServices";

export function useService(id: string) {

  const context = useServices();

  return {

    service: context.findService(id),

    updateService: context.updateService,

    removeService: context.removeService,

    duplicateService: context.duplicateService,

    toggleService: context.toggleService,

  };

}