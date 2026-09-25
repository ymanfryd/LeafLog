import {getLatestCheck} from '@/api/plantChecks';
import {useQuery} from '@tanstack/react-query';

export const useLatestCheckByPlantId = (plantId: string) => {
  return useQuery({
    queryKey: ['plant-checks', plantId, 'latest'],
    queryFn: () => getLatestCheck(plantId),
  });
};
