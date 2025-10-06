import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface Props {
  children: ReactNode;
  isDark?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { isDark = false } = this.props;
      
      return (
        <View style={[styles.container, { backgroundColor: isDark ? DarkColors.background : Colors.background }]}>
          <Card style={[styles.errorCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
            <Card.Content style={styles.errorContent}>
              <Text variant="headlineSmall" style={[styles.errorTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
                Oops! Something went wrong
              </Text>
              
              <Text variant="bodyMedium" style={[styles.errorMessage, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                The app encountered an unexpected error. This usually happens due to a temporary issue.
              </Text>
              
              {__DEV__ && this.state.error && (
                <View style={styles.errorDetails}>
                  <Text variant="bodySmall" style={[styles.errorDetailsTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
                    Error Details (Development):
                  </Text>
                  <Text variant="bodySmall" style={[styles.errorDetailsText, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                    {this.state.error.toString()}
                  </Text>
                </View>
              )}
              
              <View style={styles.errorActions}>
                <Button
                  mode="contained"
                  onPress={this.handleReload}
                  style={styles.reloadButton}
                  icon="refresh"
                >
                  Reload App
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.lg,
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    borderRadius: Sizes.radiusLg,
  },
  errorContent: {
    alignItems: 'center',
    padding: Sizes.xl,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: Sizes.md,
    fontWeight: '600',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: Sizes.lg,
    lineHeight: 20,
  },
  errorDetails: {
    width: '100%',
    marginBottom: Sizes.lg,
    padding: Sizes.md,
    backgroundColor: Colors.error + '10',
    borderRadius: Sizes.radiusMd,
  },
  errorDetailsTitle: {
    fontWeight: '600',
    marginBottom: Sizes.sm,
  },
  errorDetailsText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  errorActions: {
    width: '100%',
  },
  reloadButton: {
    borderRadius: Sizes.radiusMd,
  },
});

export default ErrorBoundary;
