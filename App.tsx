import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {createStaticNavigation} from '@react-navigation/native';
import {RootTabs} from '@/navigation/RootTabs';
import ErrorScreen from '@/screens/ErrorScreen';
import LoadingScreen from '@/screens/LoadingScreen';
import {useAppMigrations} from '@/db/migrations';

const queryClient = new QueryClient({
  defaultOptions: {queries: {staleTime: 1000 * 60}},
});
const Navigation = createStaticNavigation(RootTabs);

function App() {
  const {success, error} = useAppMigrations();

  if (error) return <ErrorScreen error={error} />;
  if (!success) return <LoadingScreen />;
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <QueryClientProvider client={queryClient}>
          <Navigation />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {flex: 1},
});
