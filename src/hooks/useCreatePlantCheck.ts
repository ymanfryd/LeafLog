import {createPlantCheck} from '@/api/plantChecks';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useCreatePlantCheck = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlantCheck,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['plant-checks']});
    },
  });
};
