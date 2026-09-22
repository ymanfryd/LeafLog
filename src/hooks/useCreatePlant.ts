import {createPlant} from '@/api/plants';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useCreatePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlant,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['plants']});
    },
  });
};
