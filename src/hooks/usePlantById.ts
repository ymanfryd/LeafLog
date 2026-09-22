import {getPlantById} from '@/api/plants';
import {useQuery} from '@tanstack/react-query';

export const usePlantById = (id: string) => {
  return useQuery({
    queryKey: ['plants', id],
    queryFn: () => getPlantById(id),
  });
};
