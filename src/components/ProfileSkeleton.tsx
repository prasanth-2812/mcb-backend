import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const ProfileSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Profile header */}
      <View style={styles.header}>
        <SkeletonLoader width={80} height={80} borderRadius={40} />
        <View style={styles.headerContent}>
          <SkeletonLoader width="60%" height={24} borderRadius={4} />
          <SkeletonLoader width="40%" height={16} borderRadius={4} style={styles.subtitle} />
          <SkeletonLoader width="50%" height={14} borderRadius={4} style={styles.location} />
        </View>
      </View>

      {/* Profile completion */}
      <View style={styles.completion}>
        <View style={styles.completionHeader}>
          <SkeletonLoader width="50%" height={18} borderRadius={4} />
          <SkeletonLoader width={60} height={18} borderRadius={4} />
        </View>
        <SkeletonLoader width="100%" height={6} borderRadius={3} style={styles.progressBar} />
      </View>

      {/* Skills section */}
      <View style={styles.section}>
        <SkeletonLoader width="30%" height={20} borderRadius={4} style={styles.sectionTitle} />
        <View style={styles.skills}>
          <SkeletonLoader width={80} height={28} borderRadius={14} />
          <SkeletonLoader width={100} height={28} borderRadius={14} style={styles.skill} />
          <SkeletonLoader width={90} height={28} borderRadius={14} style={styles.skill} />
        </View>
      </View>

      {/* Experience section */}
      <View style={styles.section}>
        <SkeletonLoader width="40%" height={20} borderRadius={4} style={styles.sectionTitle} />
        <View style={styles.experience}>
          <SkeletonLoader width="100%" height={16} borderRadius={4} />
          <SkeletonLoader width="80%" height={16} borderRadius={4} style={styles.experienceLine} />
          <SkeletonLoader width="60%" height={16} borderRadius={4} style={styles.experienceLine} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  subtitle: {
    marginTop: 4,
  },
  location: {
    marginTop: 4,
  },
  completion: {
    marginBottom: 16,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    marginLeft: 8,
    marginTop: 4,
  },
  experience: {
    marginTop: 8,
  },
  experienceLine: {
    marginTop: 4,
  },
});

export default ProfileSkeleton;
