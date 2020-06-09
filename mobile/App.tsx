import React from 'react';
import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import Routes from './src/routes';

// React native x ReactJS: O native não utiliza tags html (div, h1, strong...) e sim componentes que representam as mesmas. Ex. View = div, article, aside, footer... Text = h1, h2, strong. Ou seja, não possuem valores semanticos.

export default function App() {
  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Roboto_400Regular, 
    Roboto_500Medium
  });

  if(!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );
}

// Além disso, as estilizações são realizadas de forma diferente. Funciona como um objeto do JavaScript, porém a sintaxe do CSS é muito semelhante.
// Criando nova estilização chamada container.

