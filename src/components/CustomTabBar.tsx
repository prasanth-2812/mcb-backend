import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { state: appState } = useApp();
  const isDark = appState.theme === 'dark';

  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'home-outline';
      case 'Jobs':
        return 'briefcase-outline';
      case 'Applications':
        return 'file-document-outline';
      case 'Notifications':
        return 'bell-outline';
      case 'Profile':
        return 'account-circle-outline';
      default:
        return 'circle-outline';
    }
  };

  const getBadgeCount = (routeName: string) => {
    switch (routeName) {
      case 'Applications':
        return appState.applications.filter(app => app.status === 'Applied').length;
      case 'Notifications':
        return appState.notifications.filter(n => !n.isRead).length;
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView 
      style={[
        styles.tabBar,
        {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
        }
      ]}
      edges={['bottom']}
    >
      <View style={styles.tabContainer}>
        {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;
        const iconName = getIconName(route.name);
        const badgeCount = getBadgeCount(route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <AnimatedTabItem
            key={route.key}
            route={route}
            options={options}
            isFocused={isFocused}
            iconName={iconName}
            label={label}
            badgeCount={badgeCount}
            onPress={onPress}
          />
        );
      })}
      </View>
    </SafeAreaView>
  );
};

interface AnimatedTabItemProps {
  route: any;
  options: any;
  isFocused: boolean;
  iconName: string;
  label: string;
  badgeCount: number;
  onPress: () => void;
}

const AnimatedTabItem: React.FC<AnimatedTabItemProps> = ({
  route,
  options,
  isFocused,
  iconName,
  label,
  badgeCount,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    });
    iconScale.value = withSpring(1.2, { damping: 15, stiffness: 150 }, () => {
      iconScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    });
    onPress();
  };

  return (
    <Animated.View style={[styles.tabItem, animatedStyle]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={handlePress}
        style={styles.tabButton}
      >
        <View style={styles.iconContainer}>
          <Animated.View style={iconAnimatedStyle}>
            <MaterialCommunityIcons
              name={iconName}
              size={isFocused ? 28 : 24}
              color={isFocused ? '#1976D2' : '#B0BEC5'}
              style={styles.icon}
            />
          </Animated.View>
          {badgeCount > 0 && (
            <View style={[
              styles.badge,
              { backgroundColor: route.name === 'Applications' ? '#FF6B6B' : '#1976D2' }
            ]}>
              <Text style={styles.badgeText}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={[
          styles.tabLabel,
          {
            color: isFocused ? '#1976D2' : '#B0BEC5',
            fontWeight: isFocused ? '600' : '500',
          }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    paddingBottom: 8,
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: '100%',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});

export default CustomTabBar;
