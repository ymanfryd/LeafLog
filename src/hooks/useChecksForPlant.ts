import {getChecksForPlant} from '@/api/plantChecks';
import {useQuery} from '@tanstack/react-query';

export const usePlantChecksByPlantId = (plantId: string) => {
  return useQuery({
    queryKey: ['plant-checks', plantId],
    queryFn: () => getChecksForPlant(plantId),
  });
};
