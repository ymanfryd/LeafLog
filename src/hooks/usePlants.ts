import {getPlants} from '@/api/plants';
import {useQuery} from '@tanstack/react-query';

export const usePlants = () => {
  return useQuery({
    queryKey: ['plants'],
    queryFn: getPlants,
  });
};
