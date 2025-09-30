import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { testApiConnection } from '../utils/apiTest';

const ApiTestScreen: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runApiTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addLog('🧪 Starting API connection test...');
    
    try {
      const result = await testApiConnection();
      
      if (result.success) {
        addLog(`✅ API test successful! Loaded ${result.jobsCount} jobs`);
        Alert.alert('Success', `API connection successful! Loaded ${result.jobsCount} jobs from the database.`);
      } else {
        addLog(`❌ API test failed: ${result.error}`);
        Alert.alert('Error', `API test failed: ${result.error}`);
      }
      
    } catch (error) {
      addLog(`❌ Unexpected error: ${error.message}`);
      Alert.alert('Error', `Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.subtitle}>Test connection to MySQL database via API</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={runApiTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.logContainer}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.logText}>{result}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 10,
  },
  logText: {
    color: '#00ff00',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 2,
  },
});

export default ApiTestScreen;
