import {updatePlant} from '@/api/plants';
import type {Plant} from '@/db/types';
import {useMutation, useQueryClient} from '@tanstack/react-query';

type Args = {
  id: string;
  patch: Partial<Omit<Plant, 'id' | 'createdAt'>>;
};

export const useUpdatePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({id, patch}: Args) => updatePlant(id, patch),
    onSuccess: (_, {id}) => {
      qc.invalidateQueries({queryKey: ['plants']});
      qc.invalidateQueries({queryKey: ['plants', id]});
    },
  });
};
