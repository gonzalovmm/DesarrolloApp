import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { StatusBar } from 'expo-status-bar';
import {useEffect} from 'react'

import MainNavigator from './src/navigation/MainNavigator';

import { store } from './src/app/store';
import { Provider } from 'react-redux';

import { createSessionsTable } from './src/db';
import Toast from 'react-native-toast-message';

createSessionsTable()
  .then((result)=>console.log("Tabla creada o inicializada con éxito: ", result))
  .catch((error)=>console.log("Error al crear la tabla Sessions: ", error))

SplashScreen.preventAutoHideAsync();


export default function App() {
  const [loaded, error] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat-Variable.ttf'),
    'BebasNeue': require('./assets/fonts/BebasNeue-Regular.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
      <MainNavigator />
      <StatusBar style="light" />
    </Provider>
  );
}