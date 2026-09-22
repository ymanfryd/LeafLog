import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlantsList from '@/screens/PlantsList';
import PlantDetail from '@/screens/PlantDetail';
import AddPlant from '@/screens/AddPlant';

export const PlantsStack = createNativeStackNavigator({
  screenOptions: {headerShown: false},
  screens: {
    PlantsList: {screen: PlantsList},
    PlantDetail: {screen: PlantDetail},
    AddPlant: {screen: AddPlant},
  },
});

export default PlantsStack;
