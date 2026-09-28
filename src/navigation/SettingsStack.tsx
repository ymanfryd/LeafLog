import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Settings from '@/screens/Settings';
import LanguagePicker from '@/screens/LanguagePicker';

export const SettingsStack = createNativeStackNavigator({
  screenOptions: {headerShown: false},
  screens: {
    SettingsHome: {screen: Settings},
    LanguagePicker: {screen: LanguagePicker},
  },
});

export default SettingsStack;
