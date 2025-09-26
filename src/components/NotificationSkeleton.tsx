import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const NotificationSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Notification header */}
      <View style={styles.header}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.headerContent}>
          <SkeletonLoader width="70%" height={18} borderRadius={4} />
          <SkeletonLoader width="90%" height={14} borderRadius={4} style={styles.message} />
        </View>
        <SkeletonLoader width={8} height={8} borderRadius={4} />
      </View>

      {/* Notification time */}
      <View style={styles.footer}>
        <SkeletonLoader width={80} height={12} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  message: {
    marginTop: 4,
  },
  footer: {
    marginTop: 4,
  },
});

export default NotificationSkeleton;
