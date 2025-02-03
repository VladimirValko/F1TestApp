import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Image,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchRacesByDriver,
  selectRaces,
  selectRacesLoading,
  selectRacesError,
  clearRaces,
} from '../redux/slices/racesSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Races'>;

const RacesScreen: React.FC<Props> = ({ route }) => {
  const { driverId } = route.params;
  const dispatch = useAppDispatch();
  const races = useAppSelector(selectRaces);
  const loading = useAppSelector(selectRacesLoading);
  const error = useAppSelector(selectRacesError);

  const [isTableView, setIsTableView] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRacesByDriver({ driverId }));

    return () => {
      dispatch(clearRaces());
    };
  }, [dispatch, driverId]);

  const handleToggleView = () => {
    setLocalLoading(true);
    setIsTableView(prev => !prev);
    setLocalLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!races || races.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No race data found for this driver.</Text>
      </View>
    );
  }

  const renderCardItem = ({ item }: any) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {item.raceName} - {item.season}
          </Text>
          <Image
            style={styles.image}
            source={require('../assets/images/victory.png')}
          />
        </View>
        <Text>Date: {item.date}</Text>
        {item.Results?.[0] && (
          <View style={styles.cardResultInfo}>
            <Text style={styles.cardText}>
              Position: {item.Results[0].position}
            </Text>
            <Text style={styles.cardText}>
              Constructor: {item.Results[0].Constructor.name}
            </Text>
            <Text style={styles.cardText}>
              Status: {item.Results[0].status}
            </Text>
            <Text style={styles.cardText}>Laps: {item.Results[0].laps}</Text>
            <Text style={styles.cardText}>Grid: {item.Results[0].grid}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTableItem = ({ item }: any) => {
    const hasResults = item.Results?.[0];
    const position = hasResults ? item.Results[0].position : '-';
    const constructor = hasResults ? item.Results[0].Constructor.name : '-';
    const laps = hasResults ? item.Results[0].laps : '-';
    const grid = hasResults ? item.Results[0].grid : '-';

    return (
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.wideCell]}>{item.raceName}</Text>
        <Text style={styles.tableCell}>{item.date}</Text>
        <Text style={styles.tableCell}>{position}</Text>
        <Text style={styles.tableCell}>{constructor}</Text>
        <Text style={[styles.headerCell, styles.thinCell]}>{laps}</Text>
        <Text style={[styles.headerCell, styles.thinCell]}>{grid}</Text>
      </View>
    );
  };

  const keyExtractor = (item: any, index: number) =>
    `${item.season}-${item.round}-${index}`;

  if (localLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Switching View...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={{ marginRight: 8 }}>Table View</Text>
        <Switch
          value={!isTableView}
          onValueChange={handleToggleView}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={'#f4f3f4'}
        />
        <Text style={{ marginLeft: 8 }}>Card View</Text>
      </View>

      {isTableView && (
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.wideCell]}>Race-Name</Text>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Position</Text>
          <Text style={styles.headerCell}>Const</Text>
          <Text style={[styles.headerCell, styles.thinCell]}>Laps</Text>
          <Text style={[styles.headerCell, styles.thinCell]}>Grid</Text>
        </View>
      )}

      <FlatList
        data={races}
        keyExtractor={keyExtractor}
        renderItem={isTableView ? renderTableItem : renderCardItem}
        contentContainerStyle={
          isTableView ? styles.tableListContainer : styles.cardListContainer
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RacesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  cardListContainer: {
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  cardResultInfo: {
    padding: 5,
  },
  tableListContainer: {
    paddingBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#81b0ff',
    paddingVertical: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wideCell: {
    flex: 1.5,
  },
  thinCell: {
    flex: 0.7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    minHeight: 60,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 2,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  image: {
    height: 25,
    width: 35,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
