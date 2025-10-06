import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, RefreshControl } from 'react-native';
import { 
  Text, 
  Card, 
  useTheme, 
  Button, 
  Chip, 
  ProgressBar,
  IconButton,
  Divider,
  Surface
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { JobMatch, AIInsights } from '../services/aiRecommendationService';
import { aiRecommendationService } from '../services/aiRecommendationService';
import JobCard from '../components/JobCard';

const AIRecommendationsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  const [recommendations, setRecommendations] = useState<JobMatch[]>([]);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'insights'>('jobs');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      console.log('🤖 Loading AI recommendations...');

      if (!state.user) {
        console.log('❌ No user profile available');
        return;
      }

      // Generate AI recommendations
      const jobMatches = await aiRecommendationService.getJobRecommendations(
        state.user,
        state.jobs,
        20
      );

      // Generate AI insights
      const careerInsights = await aiRecommendationService.getCareerInsights(
        state.user,
        {} // Market data would be passed here
      );

      setRecommendations(jobMatches);
      setInsights(careerInsights);
      
      console.log(`✅ Loaded ${jobMatches.length} AI recommendations`);
    } catch (error) {
      console.error('❌ Failed to load AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRecommendations();
    setIsRefreshing(false);
  };

  const handleJobApply = async (jobId: string) => {
    // Navigate to job application screen
    (navigation as any).navigate('JobApplication', { jobId });
  };

  const renderJobMatch = (match: JobMatch, index: number) => (
    <Card key={match.job.id} style={[styles.jobCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <View style={styles.jobHeader}>
          <View style={styles.jobInfo}>
            <Text variant="titleMedium" style={[styles.jobTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              {match.job.title}
            </Text>
            <Text variant="bodyMedium" style={[styles.companyName, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
              {match.job.company}
            </Text>
            <Text variant="bodySmall" style={[styles.jobLocation, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
              {match.job.location}
            </Text>
          </View>
          <View style={styles.matchScore}>
            <Text variant="titleLarge" style={[styles.scoreText, { color: Colors.success }]}>
              {Math.round(match.matchScore * 100)}%
            </Text>
            <Text variant="bodySmall" style={[styles.scoreLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
              Match
            </Text>
          </View>
        </View>

        <View style={styles.matchReasons}>
          {match.matchReasons.slice(0, 2).map((reason, idx) => (
            <Chip key={idx} style={styles.reasonChip} mode="outlined" compact>
              {reason}
            </Chip>
          ))}
        </View>

        <View style={styles.skillMatches}>
          <Text variant="bodySmall" style={[styles.skillLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Matching Skills:
          </Text>
          <View style={styles.skillChips}>
            {match.skillMatches.slice(0, 3).map((skill, idx) => (
              <Chip key={idx} style={[styles.skillChip, { backgroundColor: Colors.success + '20' }]} compact>
                {skill}
              </Chip>
            ))}
          </View>
        </View>

        {match.missingSkills.length > 0 && (
          <View style={styles.missingSkills}>
            <Text variant="bodySmall" style={[styles.skillLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
              Skills to Learn:
            </Text>
            <View style={styles.skillChips}>
              {match.missingSkills.slice(0, 2).map((skill, idx) => (
                <Chip key={idx} style={[styles.skillChip, { backgroundColor: Colors.warning + '20' }]} compact>
                  {skill}
                </Chip>
              ))}
            </View>
          </View>
        )}

        <View style={styles.jobActions}>
          <Button
            mode="outlined"
            onPress={() => (navigation as any).navigate('JobDetails', { jobId: match.job.id })}
            style={styles.actionButton}
            compact
          >
            View Details
          </Button>
          <Button
            mode="contained"
            onPress={() => handleJobApply(match.job.id)}
            style={styles.actionButton}
            compact
          >
            Apply Now
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderInsights = () => {
    if (!insights) return null;

    return (
      <ScrollView style={styles.insightsContainer} showsVerticalScrollIndicator={false}>
        {/* Top Skills */}
        <Card style={[styles.insightCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.insightTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Your Top Skills
            </Text>
            <View style={styles.skillChips}>
              {insights.topSkills.map((skill, idx) => (
                <Chip key={idx} style={[styles.skillChip, { backgroundColor: Colors.primary + '20' }]} compact>
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Skill Gaps */}
        <Card style={[styles.insightCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.insightTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Skills to Develop
            </Text>
            <View style={styles.skillChips}>
              {insights.skillGaps.map((skill, idx) => (
                <Chip key={idx} style={[styles.skillChip, { backgroundColor: Colors.warning + '20' }]} compact>
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Career Suggestions */}
        <Card style={[styles.insightCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.insightTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Career Suggestions
            </Text>
            {insights.careerSuggestions.map((suggestion, idx) => (
              <View key={idx} style={styles.suggestionItem}>
                <MaterialCommunityIcons 
                  name="lightbulb-outline" 
                  size={20} 
                  color={Colors.primary} 
                  style={styles.suggestionIcon}
                />
                <Text variant="bodyMedium" style={[styles.suggestionText, { color: isDark ? DarkColors.text : Colors.text }]}>
                  {suggestion}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Salary Insights */}
        <Card style={[styles.insightCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.insightTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Salary Insights
            </Text>
            <View style={styles.salaryInsights}>
              <View style={styles.salaryItem}>
                <Text variant="bodySmall" style={[styles.salaryLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                  Current
                </Text>
                <Text variant="titleMedium" style={[styles.salaryValue, { color: isDark ? DarkColors.text : Colors.text }]}>
                  ${insights.salaryInsights.current.toLocaleString()}
                </Text>
              </View>
              <View style={styles.salaryItem}>
                <Text variant="bodySmall" style={[styles.salaryLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                  Market Average
                </Text>
                <Text variant="titleMedium" style={[styles.salaryValue, { color: Colors.primary }]}>
                  ${insights.salaryInsights.market.toLocaleString()}
                </Text>
              </View>
              <View style={styles.salaryItem}>
                <Text variant="bodySmall" style={[styles.salaryLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                  Potential
                </Text>
                <Text variant="titleMedium" style={[styles.salaryValue, { color: Colors.success }]}>
                  ${insights.salaryInsights.potential.toLocaleString()}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Location Insights */}
        <Card style={[styles.insightCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.insightTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Location Opportunities
            </Text>
            <Text variant="bodyMedium" style={[styles.locationText, { color: isDark ? DarkColors.text : Colors.text }]}>
              Current: {insights.locationInsights.current}
            </Text>
            <Text variant="bodyMedium" style={[styles.locationText, { color: isDark ? DarkColors.text : Colors.text }]}>
              Remote Opportunities: {insights.locationInsights.remoteOpportunities}%
            </Text>
            <View style={styles.skillChips}>
              {insights.locationInsights.opportunities.map((location, idx) => (
                <Chip key={idx} style={[styles.skillChip, { backgroundColor: Colors.info + '20' }]} compact>
                  {location}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? DarkColors.background : Colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={isDark ? DarkColors.text : Colors.text}
        />
        <Text variant="headlineSmall" style={[styles.headerTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          AI Recommendations
        </Text>
        <IconButton
          icon="refresh"
          size={24}
          onPress={handleRefresh}
          iconColor={isDark ? DarkColors.text : Colors.text}
        />
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <MaterialCommunityIcons 
            name="briefcase" 
            size={20} 
            color={activeTab === 'jobs' ? Colors.primary : (isDark ? DarkColors.textSecondary : Colors.textSecondary)} 
          />
          <Text variant="bodyMedium" style={[styles.tabText, { 
            color: activeTab === 'jobs' ? Colors.primary : (isDark ? DarkColors.textSecondary : Colors.textSecondary) 
          }]}>
            Job Matches
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <MaterialCommunityIcons 
            name="chart-line" 
            size={20} 
            color={activeTab === 'insights' ? Colors.primary : (isDark ? DarkColors.textSecondary : Colors.textSecondary)} 
          />
          <Text variant="bodyMedium" style={[styles.tabText, { 
            color: activeTab === 'insights' ? Colors.primary : (isDark ? DarkColors.textSecondary : Colors.textSecondary) 
          }]}>
            Career Insights
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ProgressBar indeterminate color={Colors.primary} />
          <Text variant="bodyMedium" style={[styles.loadingText, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            AI is analyzing your profile...
          </Text>
        </View>
      ) : activeTab === 'jobs' ? (
        <ScrollView 
          style={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {recommendations.length > 0 ? (
            recommendations.map((match, index) => renderJobMatch(match, index))
          ) : (
            <Card style={[styles.emptyCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
              <Card.Content style={styles.emptyContent}>
                <MaterialCommunityIcons name="robot" size={48} color={Colors.primary} />
                <Text variant="titleMedium" style={[styles.emptyTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
                  No AI Recommendations Yet
                </Text>
                <Text variant="bodyMedium" style={[styles.emptyText, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                  Complete your profile to get personalized job recommendations
                </Text>
                <Button
                  mode="contained"
                  onPress={() => (navigation as any).navigate('EditProfile')}
                  style={styles.emptyButton}
                >
                  Complete Profile
                </Button>
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      ) : (
        renderInsights()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    elevation: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.sm,
    borderRadius: Sizes.radiusMd,
  },
  activeTab: {
    backgroundColor: Colors.primary + '20',
  },
  tabText: {
    marginLeft: Sizes.xs,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: Sizes.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.xl,
  },
  loadingText: {
    marginTop: Sizes.md,
    textAlign: 'center',
  },
  jobCard: {
    marginBottom: Sizes.md,
    elevation: 2,
    borderRadius: Sizes.radiusLg,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizes.sm,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: '600',
    marginBottom: Sizes.xs,
  },
  companyName: {
    fontWeight: '500',
    marginBottom: Sizes.xs,
  },
  jobLocation: {
    opacity: 0.8,
  },
  matchScore: {
    alignItems: 'center',
    marginLeft: Sizes.md,
  },
  scoreText: {
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
  },
  matchReasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Sizes.sm,
  },
  reasonChip: {
    marginRight: Sizes.xs,
    marginBottom: Sizes.xs,
  },
  skillMatches: {
    marginBottom: Sizes.sm,
  },
  missingSkills: {
    marginBottom: Sizes.sm,
  },
  skillLabel: {
    marginBottom: Sizes.xs,
    fontWeight: '500',
  },
  skillChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    marginRight: Sizes.xs,
    marginBottom: Sizes.xs,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizes.sm,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Sizes.xs,
  },
  insightsContainer: {
    flex: 1,
    padding: Sizes.md,
  },
  insightCard: {
    marginBottom: Sizes.md,
    elevation: 2,
    borderRadius: Sizes.radiusLg,
  },
  insightTitle: {
    fontWeight: '600',
    marginBottom: Sizes.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  suggestionIcon: {
    marginRight: Sizes.sm,
  },
  suggestionText: {
    flex: 1,
  },
  salaryInsights: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  salaryLabel: {
    marginBottom: Sizes.xs,
  },
  salaryValue: {
    fontWeight: '600',
  },
  locationText: {
    marginBottom: Sizes.sm,
  },
  emptyCard: {
    margin: Sizes.md,
    elevation: 2,
    borderRadius: Sizes.radiusLg,
  },
  emptyContent: {
    alignItems: 'center',
    padding: Sizes.xl,
  },
  emptyTitle: {
    marginTop: Sizes.md,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: Sizes.lg,
  },
  emptyButton: {
    borderRadius: Sizes.radiusMd,
  },
});

export default AIRecommendationsScreen;
