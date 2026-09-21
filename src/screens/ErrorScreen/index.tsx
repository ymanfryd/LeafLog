import {Text} from 'react-native';

const ErrorScreen = ({error}: {error: Error}) => {
  return <Text>Error: {error.message}</Text>;
};

export default ErrorScreen;
