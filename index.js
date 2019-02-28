import { AppRegistry } from 'react-native';
import App from './src/screen/Home';
console.disableYellowBox = true;
console.warn('YellowBox is disabled.');
AppRegistry.registerComponent('CybWeather', () => App);
