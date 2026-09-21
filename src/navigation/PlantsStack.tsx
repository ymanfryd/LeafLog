import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlantsList from '@/screens/PlantsList';
import PlantDetail from '@/screens/PlantDetail';

const PlantsStack = createNativeStackNavigator({
  screenOptions: {headerShown: false},
  screens: {
    PlantsList: {screen: PlantsList},
    PlantDetail: {screen: PlantDetail},
  },
});

export default PlantsStack;
