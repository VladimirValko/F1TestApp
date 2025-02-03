import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { selectDrivers } from '../redux/slices/driversSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverDetails'>;

const DriverDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { driverId } = route.params;
  const drivers = useAppSelector(selectDrivers);

  const driver = useMemo(
    () => drivers.find(d => d.driverId === driverId),
    [drivers, driverId],
  );

  if (!driver) {
    return (
      <View style={styles.centered}>
        <Text>Driver not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={require('../assets/images/racing-helmet.png')}
        />
      </View>
      <Text style={styles.name}>
        {driver.givenName} {driver.familyName}
      </Text>
      <Text>Date of Birth: {driver.dateOfBirth}</Text>
      <Text>Nationality: {driver.nationality}</Text>

      <View style={styles.button}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Races', { driverId: driverId })}>
          <Text>Show Race Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    height: 80,
    width: 80,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DriverDetailsScreen;
