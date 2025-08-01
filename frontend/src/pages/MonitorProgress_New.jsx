import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Calendar, Users, Award, CheckCircle2, Clock, AlertTriangle, Filter, Download } from 'lucide-react';
import styled from 'styled-components';
import { 
  Container, 
  Grid, 
  Flex, 
  GlassCard, 
  Heading1, 
  Heading2,
  Heading3,
  Heading4,
  Text, 
  Badge,
  PrimaryButton,
  SecondaryButton,
  Input,
  theme,
  MainContent
} from '../components/styled/StyledComponents';
import { useInternshipData } from '../hooks/useInternshipData';
import Sidebar from '../components/Sidebar';

const PageHeader = styled(Flex)`
  margin-bottom: ${theme.spacing[6]};
  align-items: flex-start;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing[4]};
  }
`;

const StatsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
`;

const ContentGrid = styled(Grid)`
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing[6]};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(GlassCard)`
  padding: ${theme.spacing[6]};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color || theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[2]};
`;

const StatLabel = styled(Text)`
  font-weight: 500;
  color: ${theme.colors.gray[600]};
`;

const ProgressSection = styled(GlassCard)`
  padding: ${theme.spacing[6]};
`;

const InternProgressCard = styled(GlassCard)`
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  border-left: 4px solid ${props => {
    if (props.progress >= 80) return theme.colors.success[500];
    if (props.progress >= 60) return theme.colors.warning[500];
    return theme.colors.error[500];
  }};
`;

const InternHeader = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[3]};
`;

const InternInfo = styled(Flex)`
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const InternAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  border-radius: ${theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${theme.colors.gray[200]};
  border-radius: ${theme.radius.full};
  overflow: hidden;
  margin-bottom: ${theme.spacing[3]};
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => {
    if (props.progress >= 80) return `${theme.colors.success[400]}, ${theme.colors.success[500]}`;
    if (props.progress >= 60) return `${theme.colors.warning[400]}, ${theme.colors.warning[500]}`;
    return `${theme.colors.error[400]}, ${theme.colors.error[500]}`;
  }});
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const TaskItem = styled(Flex)`
  align-items: center;
  justify-content: between;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: rgba(248, 250, 252, 0.5);
  border-radius: ${theme.radius.md};
`;

const FilterSection = styled(GlassCard)`
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const FilterRow = styled(Flex)`
  gap: ${theme.spacing[3]};
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LeaderboardCard = styled(GlassCard)`
  padding: ${theme.spacing[6]};
`;

const LeaderboardItem = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[2]};
  background: rgba(248, 250, 252, 0.5);
  border-radius: ${theme.radius.lg};
  
  &:first-child {
    background: linear-gradient(135deg, ${theme.colors.warning[50]}, ${theme.colors.warning[100]});
    border: 1px solid ${theme.colors.warning[200]};
  }
`;

const RankBadge = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${props => {
    if (props.rank === 1) return `linear-gradient(135deg, ${theme.colors.warning[400]}, ${theme.colors.warning[500]})`;
    if (props.rank === 2) return `linear-gradient(135deg, ${theme.colors.gray[400]}, ${theme.colors.gray[500]})`;
    if (props.rank === 3) return `linear-gradient(135deg, ${theme.colors.orange[400]}, ${theme.colors.orange[500]})`;
    return theme.colors.gray[200];
  }};
  border-radius: ${theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const MonitorProgress_New = () => {
  const { interns } = useInternshipData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgress, setFilterProgress] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock progress data
  const progressData = interns.map((intern, index) => ({
    ...intern,
    progress: Math.floor(Math.random() * 100),
    tasksCompleted: Math.floor(Math.random() * 15) + 5,
    totalTasks: Math.floor(Math.random() * 5) + 15,
    weeklyHours: Math.floor(Math.random() * 20) + 20,
    lastActive: `${Math.floor(Math.random() * 5) + 1} hours ago`,
    currentTasks: [
      { id: 1, title: 'Frontend Development', status: 'in-progress', dueDate: '2024-01-20' },
      { id: 2, title: 'Code Review', status: 'completed', dueDate: '2024-01-18' },
      { id: 3, title: 'Documentation', status: 'pending', dueDate: '2024-01-22' }
    ]
  }));

  const filteredInterns = progressData.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterProgress === 'all' || 
      (filterProgress === 'high' && intern.progress >= 80) ||
      (filterProgress === 'medium' && intern.progress >= 60 && intern.progress < 80) ||
      (filterProgress === 'low' && intern.progress < 60);
    return matchesSearch && matchesFilter;
  });

  const getOverallStats = () => {
    const totalInterns = progressData.length;
    const avgProgress = Math.round(progressData.reduce((sum, intern) => sum + intern.progress, 0) / totalInterns);
    const totalTasksCompleted = progressData.reduce((sum, intern) => sum + intern.tasksCompleted, 0);
    const totalHours = progressData.reduce((sum, intern) => sum + intern.weeklyHours, 0);
    const highPerformers = progressData.filter(intern => intern.progress >= 80).length;

    return {
      totalInterns,
      avgProgress,
      totalTasksCompleted,
      totalHours,
      highPerformers
    };
  };

  const stats = getOverallStats();

  const getProgressColor = (progress) => {
    if (progress >= 80) return theme.colors.success[500];
    if (progress >= 60) return theme.colors.warning[500];
    return theme.colors.error[500];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} color={theme.colors.success[500]} />;
      case 'in-progress':
        return <Clock size={16} color={theme.colors.warning[500]} />;
      case 'pending':
        return <AlertTriangle size={16} color={theme.colors.error[500]} />;
      default:
        return <Clock size={16} color={theme.colors.gray[400]} />;
    }
  };

  const exportProgress = () => {
    const csvData = progressData.map(intern => ({
      Name: intern.name,
      Progress: `${intern.progress}%`,
      TasksCompleted: intern.tasksCompleted,
      TotalTasks: intern.totalTasks,
      WeeklyHours: intern.weeklyHours,
      LastActive: intern.lastActive
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csvString = [headers, ...rows].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intern-progress-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const leaderboard = [...progressData]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Sidebar />
      <MainContent>
        <Container>
          <PageHeader>
            <div>
              <Heading1>Monitor Progress</Heading1>
              <Text variant="secondary">Track intern performance and project advancement in real-time.</Text>
            </div>
            <Flex gap={theme.spacing[3]}>
              <SecondaryButton onClick={exportProgress}>
                <Download size={20} />
                Export Report
              </SecondaryButton>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
              padding: theme.spacing[3],
              border: `1px solid ${theme.colors.gray[200]}`,
              borderRadius: theme.radius.lg,
              background: 'white'
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </Flex>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue color={theme.colors.primary[600]}>{stats.totalInterns}</StatValue>
          <StatLabel>Total Interns</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue color={theme.colors.success[600]}>{stats.avgProgress}%</StatValue>
          <StatLabel>Average Progress</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue color={theme.colors.info[600]}>{stats.totalTasksCompleted}</StatValue>
          <StatLabel>Tasks Completed</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue color={theme.colors.warning[600]}>{stats.totalHours}h</StatValue>
          <StatLabel>Total Hours</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue color={theme.colors.purple[600]}>{stats.highPerformers}</StatValue>
          <StatLabel>High Performers</StatLabel>
        </StatCard>
      </StatsGrid>

      <FilterSection>
        <FilterRow>
          <div style={{ flex: 2 }}>
            <Input
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Filter size={20} />}
            />
          </div>
          <div style={{ flex: 1 }}>
            <select
              value={filterProgress}
              onChange={(e) => setFilterProgress(e.target.value)}
              style={{
                width: '100%',
                padding: theme.spacing[3],
                border: `1px solid ${theme.colors.gray[200]}`,
                borderRadius: theme.radius.lg,
                background: 'white'
              }}
            >
              <option value="all">All Progress Levels</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (60-79%)</option>
              <option value="low">Low (Below 60%)</option>
            </select>
          </div>
        </FilterRow>
      </FilterSection>

      <ContentGrid>
        <ProgressSection>
          <Heading3 style={{ marginBottom: theme.spacing[6] }}>
            <BarChart3 size={20} style={{ marginRight: theme.spacing[2] }} />
            Individual Progress ({filteredInterns.length})
          </Heading3>
          
          {filteredInterns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: theme.spacing[8] }}>
              <Users size={48} color={theme.colors.gray[400]} style={{ marginBottom: theme.spacing[4] }} />
              <Text>No interns found matching your criteria.</Text>
            </div>
          ) : (
            <div>
              {filteredInterns.map((intern) => (
                <InternProgressCard key={intern.id} progress={intern.progress}>
                  <InternHeader>
                    <InternInfo>
                      <InternAvatar>
                        {intern.name.split(' ').map(n => n[0]).join('')}
                      </InternAvatar>
                      <div>
                        <Text style={{ fontWeight: '500', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
                          {intern.name}
                        </Text>
                        <Text size="sm" variant="muted" noMargin>
                          {intern.role} • Last active: {intern.lastActive}
                        </Text>
                      </div>
                    </InternInfo>
                    <Flex gap={theme.spacing[2]} align="center">
                      <Badge variant={intern.progress >= 80 ? 'success' : intern.progress >= 60 ? 'warning' : 'error'}>
                        {intern.progress}% Complete
                      </Badge>
                    </Flex>
                  </InternHeader>
                  
                  <ProgressBar>
                    <ProgressFill progress={intern.progress} />
                  </ProgressBar>
                  
                  <Flex justify="between" style={{ marginBottom: theme.spacing[3] }}>
                    <Text size="sm" variant="muted">
                      {intern.tasksCompleted} of {intern.totalTasks} tasks completed
                    </Text>
                    <Text size="sm" variant="muted">
                      {intern.weeklyHours}h this week
                    </Text>
                  </Flex>
                  
                  <TaskList>
                    {intern.currentTasks.slice(0, 3).map((task) => (
                      <TaskItem key={task.id}>
                        <Flex align="center" gap={theme.spacing[2]} style={{ flex: 1 }}>
                          {getStatusIcon(task.status)}
                          <Text size="sm" style={{ fontWeight: '500' }}>{task.title}</Text>
                        </Flex>
                        <Text size="sm" variant="muted">Due: {task.dueDate}</Text>
                      </TaskItem>
                    ))}
                  </TaskList>
                </InternProgressCard>
              ))}
            </div>
          )}
        </ProgressSection>

        <LeaderboardCard>
          <Heading3 style={{ marginBottom: theme.spacing[6] }}>
            <Award size={20} style={{ marginRight: theme.spacing[2] }} />
            Top Performers
          </Heading3>
          
          <div>
            {leaderboard.map((intern, index) => (
              <LeaderboardItem key={intern.id}>
                <Flex align="center" gap={theme.spacing[3]}>
                  <RankBadge rank={index + 1}>
                    {index + 1}
                  </RankBadge>
                  <div>
                    <Text style={{ fontWeight: '500', marginBottom: theme.spacing[1] }} noMargin>
                      {intern.name}
                    </Text>
                    <Text size="sm" variant="muted" noMargin>
                      {intern.role}
                    </Text>
                  </div>
                </Flex>
                <Flex align="center" gap={theme.spacing[2]}>
                  <Text style={{ fontWeight: '600', color: getProgressColor(intern.progress) }}>
                    {intern.progress}%
                  </Text>
                  <TrendingUp size={16} color={theme.colors.success[500]} />
                </Flex>
              </LeaderboardItem>
            ))}
          </div>
          
          <div style={{ marginTop: theme.spacing[6], padding: theme.spacing[4], background: theme.colors.primary[50], borderRadius: theme.radius.lg }}>
            <Text style={{ fontWeight: '500', color: theme.colors.primary[700], marginBottom: theme.spacing[2] }} noMargin>
              Weekly Goal Achievement
            </Text>
            <Text size="sm" variant="muted">
              {stats.highPerformers} out of {stats.totalInterns} interns have achieved 80%+ progress this week.
            </Text>
          </div>
        </LeaderboardCard>
      </ContentGrid>
    </Container>
        </MainContent>
      </div>
  );
};

export default MonitorProgress_New;
