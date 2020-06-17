import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, ImageBackground, View, Text, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

interface ufProps {
  sigla: string;
}

interface cityProps {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  }

  useEffect(() => {
    axios.get<ufProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(
      response => {
        const statesResponse = response.data.map(uf => uf.sigla);

        setUfs(statesResponse);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios.get<cityProps[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(
      response => {
        const citiesResponse = response.data.map(city => city.nome);

        setCities(citiesResponse);
      }
    );
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
          <Text style={styles.description}>Ajudando pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>

        <View>
          <RNPickerSelect
            onValueChange={(uf) => uf !== 'UF' && setSelectedUf(uf)}
            placeholder={{ label: 'UF', value: '0' }}
            items={ufs.map((uf) => {
              return { key: uf, label: uf, value: uf };
            })}
          />

          <RNPickerSelect
            onValueChange={(city) => setSelectedCity(city)}
            placeholder={{ label: 'Cidade', value: '0' }}
            items={cities.map((city) => {
              return { key: city, label: city, value: city}
            })}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
