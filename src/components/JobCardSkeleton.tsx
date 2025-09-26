import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const JobCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header with logo and title */}
      <View style={styles.header}>
        <SkeletonLoader width={48} height={48} borderRadius={24} />
        <View style={styles.headerContent}>
          <SkeletonLoader width="70%" height={20} borderRadius={4} />
          <SkeletonLoader width="50%" height={16} borderRadius={4} style={styles.companyName} />
        </View>
      </View>

      {/* Job details */}
      <View style={styles.details}>
        <SkeletonLoader width="100%" height={16} borderRadius={4} />
        <SkeletonLoader width="80%" height={16} borderRadius={4} style={styles.description} />
      </View>

      {/* Tags and salary */}
      <View style={styles.footer}>
        <View style={styles.tags}>
          <SkeletonLoader width={60} height={24} borderRadius={12} />
          <SkeletonLoader width={80} height={24} borderRadius={12} style={styles.tag} />
        </View>
        <SkeletonLoader width={100} height={20} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  companyName: {
    marginTop: 4,
  },
  details: {
    marginBottom: 12,
  },
  description: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
  },
  tag: {
    marginLeft: 8,
  },
});

export default JobCardSkeleton;
