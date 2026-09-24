import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text} from 'react-native';
import {colors} from '@/theme';
import Settings from '@/screens/Settings';
import PlantsStack from './PlantsStack';
import {useTranslation} from 'react-i18next';

function TabLabel({textKey, color}: {textKey: string; color: string}) {
  const {t} = useTranslation();
  return <Text style={[styles.label, {color}]}>{t(textKey)}</Text>;
}

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
        tabBarLabel: ({color}) => (
          <TabLabel textKey="plants.title" color={color} />
        ),
        tabBarIcon: () => <Text>🌿</Text>,
      },
    },
    Settings: {
      screen: Settings,
      options: {
        tabBarLabel: ({color}) => (
          <TabLabel textKey="settings.title" color={color} />
        ),
        tabBarIcon: () => <Text>⚙️</Text>,
      },
    },
  },
});

const styles = StyleSheet.create({
  label: {fontSize: 10},
});
