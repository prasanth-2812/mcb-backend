import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { apiService } from '../services/api';

const ApiTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addLog('🧪 Starting API connection test...');
    
    try {
      // Test 1: Health Check
      addLog('🔍 Testing health endpoint...');
      const health = await apiService.healthCheck();
      addLog(`✅ Health check passed: ${JSON.stringify(health)}`);
      
      // Test 2: Jobs endpoint
      addLog('📋 Testing jobs endpoint...');
      const jobs = await apiService.getJobs();
      addLog(`✅ Jobs endpoint passed: ${jobs.length} jobs received`);
      
      // Test 3: Sample job data
      if (jobs.length > 0) {
        const sampleJob = jobs[0];
        addLog(`📊 Sample job: ${sampleJob.title} at ${sampleJob.company}`);
      }
      
      addLog('🎉 All API tests passed successfully!');
      
    } catch (error) {
      addLog(`❌ API test failed: ${error.message}`);
      addLog(`🔍 Error details: ${JSON.stringify(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={testApiConnection}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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

export default ApiTestComponent;
