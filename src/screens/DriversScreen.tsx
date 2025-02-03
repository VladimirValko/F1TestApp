import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
  Switch,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchDrivers,
  selectDrivers,
  selectDriversLoading,
  selectDriversError,
  selectDriversOffset,
  selectDriversLimit,
  selectDriversTotal,
  setOffset,
} from '../redux/slices/driversSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Driver = {
  driverId: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  url?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Drivers'>;

const DriversScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const drivers = useAppSelector(selectDrivers);
  const loading = useAppSelector(selectDriversLoading);
  const error = useAppSelector(selectDriversError);
  const offset = useAppSelector(selectDriversOffset);
  const limit = useAppSelector(selectDriversLimit);
  const total = useAppSelector(selectDriversTotal);

  const [isTableView, setIsTableView] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDrivers({ limit, offset }));
  }, [dispatch, limit, offset]);

  const handleToggleView = () => {
    setIsSwitchLoading(true);
    setIsTableView(prev => !prev);
    setTimeout(() => {
      setIsSwitchLoading(false);
    }, 400);
  };

  const handleNextPage = () => {
    if (offset + limit < total) {
      dispatch(setOffset(offset + limit));
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      dispatch(setOffset(offset - limit));
    }
  };

  const renderItemTable: ListRenderItem<Driver> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.tableRow}
        onPress={() => {
          navigation.navigate('DriverDetails', { driverId: item.driverId });
        }}>
        <Text style={[styles.tableCell, styles.nameCell]}>
          {item.givenName} {item.familyName}
        </Text>
        <Text style={styles.tableCell}>{item.dateOfBirth}</Text>
        <Text style={styles.tableCell}>{item.nationality}</Text>
      </TouchableOpacity>
    );
  };

  const renderItemCard: ListRenderItem<Driver> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('DriverDetails', { driverId: item.driverId });
        }}>
        <Text style={styles.cardTitle}>
          {item.givenName} {item.familyName}
        </Text>
        <Text style={styles.cardSubtitle}>DOB: {item.dateOfBirth}</Text>
        <Text style={styles.cardSubtitle}>Nationality: {item.nationality}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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

        {loading || isSwitchLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#000" />
            {isSwitchLoading && <Text>Switching View...</Text>}
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        ) : (
          <>
            {isTableView ? (
              <>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
                  <Text style={styles.headerCell}>Date of Birth</Text>
                  <Text style={styles.headerCell}>Nationality</Text>
                </View>
                <FlatList
                  data={drivers}
                  keyExtractor={item => item.driverId}
                  renderItem={renderItemTable}
                  style={styles.tableBody}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <FlatList
                data={drivers}
                keyExtractor={item => item.driverId}
                renderItem={renderItemCard}
                contentContainerStyle={styles.cardList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}
      </View>

      <View style={styles.pagination}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePrevPage} disabled={offset === 0}>
            <Text>Prev</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text>
            Page: {offset / limit + 1} / {Math.ceil(total / limit)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleNextPage}
            disabled={offset + limit >= total}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DriversScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
    marginBottom: 60,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#81b0ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  nameCell: {
    flex: 1.3,
  },
  tableBody: {
    borderWidth: 1,
    borderColor: '#f4f4f4',
    borderTopWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f6f6f6',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
    padding: 10,
  },
  cardList: {
    paddingVertical: 8,
  },
  card: {
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
  cardSubtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },

  pagination: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  buttonContainer: {
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
