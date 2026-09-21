import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {colors} from '@/theme';
import Settings from '@/screens/Settings';
import PlantsStack from './PlantsStack';

export const RootTabs = createBottomTabNavigator({
  initialRouteName: 'Plants',
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarStyle: {backgroundColor: colors.background},
  },
  screens: {
    Plants: {
      screen: PlantsStack,
      options: {
        tabBarLabel: 'Plants',
        tabBarIcon: () => <Text>🌿</Text>,
      },
    },
    Settings: {
      screen: Settings,
      options: {
        tabBarLabel: 'Settings',
        tabBarIcon: () => <Text>⚙️</Text>,
      },
    },
  },
});
