import { useQuery } from '@tanstack/react-query';
import { StyleSheet, ActivityIndicator, Button } from 'react-native';

import { testConnection } from '../../src/services/testService';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['testConnection'],
    queryFn: testConnection,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Test</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      {isError && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
          <Button title="Retry Connection" onPress={() => refetch()} />
        </View>
      )}

      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Response data:</Text>
          <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  dataContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
  },
  dataTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dataText: {
    fontFamily: 'Courier',
    fontSize: 12,
  },
});
