import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const JobLoadingDebug: React.FC = () => {
  const { state } = useApp();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      jobsCount: state.jobs.length,
      isLoading: state.isLoading,
      user: state.user ? state.user.name : 'None',
      hasJobs: state.jobs.length > 0,
      firstJob: state.jobs[0] ? {
        id: state.jobs[0].id,
        title: state.jobs[0].title,
        company: state.jobs[0].company
      } : null,
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
    console.log('🔍 JobLoadingDebug:', info);
  }, [state.jobs, state.isLoading, state.user]);


  return (
    <Card style={styles.debugCard}>
      <Card.Content>
        <Text style={styles.title}>Job Loading Debug</Text>
        <Text style={styles.info}>Jobs Count: {debugInfo.jobsCount}</Text>
        <Text style={styles.info}>Is Loading: {debugInfo.isLoading ? 'Yes' : 'No'}</Text>
        <Text style={styles.info}>User: {debugInfo.user}</Text>
        <Text style={styles.info}>Has Jobs: {debugInfo.hasJobs ? 'Yes' : 'No'}</Text>
        {debugInfo.firstJob && (
          <Text style={styles.info}>First Job: {debugInfo.firstJob.title}</Text>
        )}
        <Text style={styles.info}>Timestamp: {debugInfo.timestamp}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  debugCard: {
    margin: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default JobLoadingDebug;
