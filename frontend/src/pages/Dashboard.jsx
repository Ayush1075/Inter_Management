import React from 'react';
import { Users, ClipboardList, CheckCircle, Calendar, MessageCircle, TrendingUp } from 'lucide-react';
import styled from 'styled-components';
import { 
  Container, 
  Grid, 
  Flex, 
  GlassCard, 
  StatCard, 
  Heading1, 
  Heading2,
  Heading3,
  Text, 
  Badge,
  theme
} from '../components/styled/StyledComponents';
import { useInternshipData } from '../hooks/useInternshipData';

const DashboardHeader = styled(Flex)`
  margin-bottom: ${theme.spacing[6]};
`;

const DateInfo = styled.div`
  text-align: right;
`;

const StatsGrid = styled(Grid)`
  margin-bottom: ${theme.spacing[6]};
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const MainGrid = styled(Grid)`
  grid-template-columns: 1fr;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MessageItem = styled(GlassCard)`
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
`;

const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  flex-shrink: 0;
  
  ${props => {
    if (props.type === 'broadcast') return `background: ${theme.colors.primary[100]}; color: ${theme.colors.primary[700]};`;
    if (props.sender === 'Admin') return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
    return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
  }}
`;

const InternItem = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[3]};
  background: rgba(248, 250, 252, 0.5);
  border-radius: ${theme.radius.lg};
  margin-bottom: ${theme.spacing[3]};
`;

const InternAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  border-radius: ${theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
`;

const QuickActionButton = styled.button`
  width: 100%;
  padding: ${theme.spacing[3]};
  text-align: left;
  background: rgba(248, 250, 252, 0.5);
  border: 1px solid transparent;
  border-radius: ${theme.radius.lg};
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: ${theme.spacing[2]};

  &:hover {
    background: rgba(241, 245, 249, 0.8);
    border-color: ${theme.colors.gray[200]};
  }
`;

const Dashboard = () => {
  const { getStats, messages, interns } = useInternshipData();
  const stats = getStats();

  const recentMessages = messages.slice(-4).reverse();
  const recentInterns = interns.slice(-3);

  return (
    <Container>
      <DashboardHeader justify="space-between" align="flex-start" responsive>
        <div>
          <Heading1>Dashboard</Heading1>
          <Text variant="secondary">Welcome back! Here's what's happening with your interns today.</Text>
        </div>
        <DateInfo>
          <Text size="sm" variant="muted">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Text>
          <Text style={{ fontWeight: '600', color: theme.colors.gray[900] }}>
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </DateInfo>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
            <Users size={24} color={theme.colors.primary[600]} />
            <Badge variant="success">+2 this month</Badge>
          </Flex>
          <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
            {stats.totalInterns}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Total Interns
          </Text>
        </StatCard>
        
        <StatCard>
          <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
            <ClipboardList size={24} color={theme.colors.warning[600]} />
            <Badge variant="warning">3 due this week</Badge>
          </Flex>
          <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
            {stats.pendingTasks}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Pending Tasks
          </Text>
        </StatCard>
        
        <StatCard>
          <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
            <CheckCircle size={24} color={theme.colors.success[600]} />
            <Badge variant="success">+5 this week</Badge>
          </Flex>
          <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
            {stats.completedTasks}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Completed Tasks
          </Text>
        </StatCard>
        
        <StatCard>
          <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
            <Calendar size={24} color={theme.colors.primary[600]} />
            <Badge variant="primary">+2% from last week</Badge>
          </Flex>
          <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
            {stats.averageAttendance}%
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Attendance Rate
          </Text>
        </StatCard>
      </StatsGrid>

      <MainGrid>
        <GlassCard>
          <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[6] }}>
            <Heading2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
              <MessageCircle size={20} color={theme.colors.primary[600]} />
              Recent Messages & Announcements
            </Heading2>
            {stats.unreadMessages > 0 && (
              <Badge variant="error">
                {stats.unreadMessages} unread
              </Badge>
            )}
          </Flex>
          
          <div>
            {recentMessages.map((message) => (
              <MessageItem key={message.id} padding="4">
                <Flex gap="3">
                  <Avatar type={message.type} sender={message.sender}>
                    {message.sender === 'Admin' ? 'AD' : message.sender.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[1] }}>
                      <Flex align="center" gap="2">
                        <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                          {message.sender}
                        </Text>
                        <Text size="sm" variant="muted" noMargin>
                          → {message.receiver}
                        </Text>
                        {message.type === 'broadcast' && (
                          <Badge variant="primary">Broadcast</Badge>
                        )}
                      </Flex>
                      <Text size="sm" variant="muted" noMargin>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Flex>
                    <Text size="sm" noMargin>
                      {message.content}
                    </Text>
                  </div>
                </Flex>
              </MessageItem>
            ))}
          </div>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
          <GlassCard>
            <Heading3 style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
              <Users size={20} color={theme.colors.primary[600]} />
              Recent Interns
            </Heading3>
            <div>
              {recentInterns.map((intern) => (
                <InternItem key={intern.id}>
                  <Flex align="center" gap="3">
                    <InternAvatar>
                      {intern.name.split(' ').map(n => n[0]).join('')}
                    </InternAvatar>
                    <div>
                      <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                        {intern.name}
                      </Text>
                      <Text size="sm" variant="muted" noMargin>
                        {intern.role}
                      </Text>
                    </div>
                  </Flex>
                  <Badge 
                    variant={
                      intern.taskStatus === 'Completed' ? 'success' :
                      intern.taskStatus === 'In Progress' ? 'warning' :
                      'neutral'
                    }
                  >
                    {intern.taskStatus}
                  </Badge>
                </InternItem>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <Heading3 style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
              <TrendingUp size={20} color={theme.colors.primary[600]} />
              Quick Actions
            </Heading3>
            <div>
              <QuickActionButton>
                <Flex align="center" gap="3">
                  <ClipboardList size={16} color={theme.colors.primary[600]} />
                  <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                    Assign New Task
                  </Text>
                </Flex>
              </QuickActionButton>
              
              <QuickActionButton>
                <Flex align="center" gap="3">
                  <Calendar size={16} color={theme.colors.primary[600]} />
                  <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                    Mark Attendance
                  </Text>
                </Flex>
              </QuickActionButton>
              
              <QuickActionButton>
                <Flex align="center" gap="3">
                  <MessageCircle size={16} color={theme.colors.primary[600]} />
                  <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                    Send Announcement
                  </Text>
                </Flex>
              </QuickActionButton>
            </div>
          </GlassCard>
        </div>
      </MainGrid>
    </Container>
  );
};

export default Dashboard;
