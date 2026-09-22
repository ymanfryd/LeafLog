import {deletePlant} from '@/api/plants';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useDeletePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePlant,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['plants']});
    },
  });
};
