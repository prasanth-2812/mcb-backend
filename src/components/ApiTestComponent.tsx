import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { authService } from '../services/authService';
import { apiService } from '../services/api';

const ApiTestComponent: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔄 Testing API health check...');
      const healthResult = await authService.healthCheck();
      addResult(`✅ Health check passed: ${JSON.stringify(healthResult)}`);
      
      addResult('🔄 Testing jobs API...');
      const jobs = await apiService.getJobs();
      addResult(`✅ Jobs API passed: Found ${jobs.length} jobs`);
      
      addResult('🔄 Testing registration endpoint...');
      // Test registration with dummy data
      try {
        await authService.register({
          email: 'test@example.com',
          password: 'testpassword123',
          name: 'Test User',
          role: 'employee'
        });
        addResult('✅ Registration endpoint accessible');
      } catch (regError) {
        if (regError.message.includes('User already exists')) {
          addResult('✅ Registration endpoint accessible (user exists)');
        } else {
          addResult(`⚠️ Registration endpoint error: ${regError.message}`);
        }
      }
      
      addResult('🎉 All API tests completed successfully!');
      
    } catch (error) {
      addResult(`❌ API test failed: ${error.message}`);
      Alert.alert('API Test Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          API Connection Test
        </Text>
        
        <Button
          mode="contained"
          onPress={testApiConnection}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Button>
        
        {testResults.length > 0 && (
          <View style={styles.results}>
            <Text variant="titleSmall" style={styles.resultsTitle}>
              Test Results:
            </Text>
            {testResults.map((result, index) => (
              <Text key={index} variant="bodySmall" style={styles.resultText}>
                {result}
              </Text>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 16,
  },
  results: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    maxHeight: 200,
  },
  resultsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default ApiTestComponent;