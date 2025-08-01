import React, { useState } from 'react';
import { MessageSquare, Bell, Send, Plus, Search, Filter, Pin, Calendar, Users, Eye, EyeOff } from 'lucide-react';
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
  Textarea,
  Modal,
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

const ContentGrid = styled(Grid)`
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(GlassCard)`
  padding: ${theme.spacing[6]};
  height: fit-content;
`;

const CustomModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing[4]};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${theme.radius.xl};
  padding: ${theme.spacing[8]};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const MessageItem = styled(GlassCard)`
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'announcement': return theme.colors.primary[500];
      case 'urgent': return theme.colors.error[500];
      case 'info': return theme.colors.info[500];
      default: return theme.colors.gray[300];
    }
  }};
`;

const MessageHeader = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[3]};
`;

const MessageMeta = styled(Flex)`
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const MessageActions = styled(Flex)`
  gap: ${theme.spacing[2]};
`;

const MessageContent = styled.div`
  margin-bottom: ${theme.spacing[3]};
`;

const MessageStats = styled(Flex)`
  gap: ${theme.spacing[4]};
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.gray[100]};
`;

const StatItem = styled(Flex)`
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const SearchFilter = styled(GlassCard)`
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.gray[500]};
`;

const FormRow = styled(Flex)`
  gap: ${theme.spacing[4]};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MessagesAnnouncements_New = () => {
  const { interns } = useInternshipData();
  const [activeTab, setActiveTab] = useState('announcements');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'announcement',
    recipients: 'all',
    specificRecipient: '',
    pinned: false
  });

  // Mock data for announcements and messages
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Welcome to the Internship Program!',
      content: 'We are excited to have you join our summer internship program. Please check your email for onboarding materials.',
      type: 'announcement',
      author: 'Program Manager',
      date: '2024-01-15',
      pinned: true,
      views: 24,
      recipients: 'all'
    },
    {
      id: 2,
      title: 'Weekly Team Meeting',
      content: 'Our weekly team meeting will be held every Friday at 2 PM in the conference room.',
      type: 'info',
      author: 'Team Lead',
      date: '2024-01-14',
      pinned: false,
      views: 18,
      recipients: 'all'
    },
    {
      id: 3,
      title: 'Project Deadline Reminder',
      content: 'Reminder: Your mid-term project is due next Friday. Please submit your code and documentation.',
      type: 'urgent',
      author: 'Supervisor',
      date: '2024-01-13',
      pinned: true,
      views: 20,
      recipients: 'development'
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Great work on the presentation today! Keep up the excellent progress.',
      author: 'Mentor',
      recipient: 'John Doe',
      date: '2024-01-15',
      time: '10:30 AM',
      read: true
    },
    {
      id: 2,
      content: 'Please review the code changes I made to your project and let me know if you have any questions.',
      author: 'Code Reviewer',
      recipient: 'Jane Smith',
      date: '2024-01-15',
      time: '09:15 AM',
      read: false
    },
    {
      id: 3,
      content: 'Your task has been updated with additional requirements. Check the task management system.',
      author: 'Project Manager',
      recipient: 'Mike Johnson',
      date: '2024-01-14',
      time: '04:45 PM',
      read: true
    }
  ]);

  const createAnnouncement = () => {
    const announcement = {
      id: Date.now(),
      ...newAnnouncement,
      author: 'You',
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      content: '',
      type: 'announcement',
      recipients: 'all',
      specificRecipient: '',
      pinned: false
    });
    setShowCreateModal(false);
  };

  const togglePin = (id) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, pinned: !ann.pinned } : ann
    ));
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || ann.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <Bell size={16} />;
      case 'urgent':
        return <Bell size={16} color={theme.colors.error[500]} />;
      case 'info':
        return <MessageSquare size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'announcement':
        return <Badge variant="primary">Announcement</Badge>;
      case 'urgent':
        return <Badge variant="error">Urgent</Badge>;
      case 'info':
        return <Badge variant="info">Info</Badge>;
      default:
        return <Badge variant="secondary">General</Badge>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Sidebar />
      <MainContent>
        <Container>
          <PageHeader>
            <div>
              <Heading1>Messages & Announcements</Heading1>
              <Text variant="secondary">Communicate with your team and share important updates.</Text>
            </div>
            <PrimaryButton onClick={() => setShowCreateModal(true)}>
              <Plus size={20} />
              Create Announcement
            </PrimaryButton>
          </PageHeader>

      <SearchFilter>
        <FilterRow>
          <div style={{ flex: 2 }}>
            <Input
              placeholder="Search messages and announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} />}
            />
          </div>
          <div style={{ flex: 1 }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: theme.spacing[3],
                border: `1px solid ${theme.colors.gray[200]}`,
                borderRadius: theme.radius.lg,
                background: 'white'
              }}
            >
              <option value="all">All Types</option>
              <option value="announcement">Announcements</option>
              <option value="urgent">Urgent</option>
              <option value="info">Information</option>
            </select>
          </div>
          <Flex gap={theme.spacing[2]}>
            <SecondaryButton
              variant={activeTab === 'announcements' ? 'filled' : 'outlined'}
              onClick={() => setActiveTab('announcements')}
            >
              <Bell size={16} />
              Announcements
            </SecondaryButton>
            <SecondaryButton
              variant={activeTab === 'messages' ? 'filled' : 'outlined'}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare size={16} />
              Messages
            </SecondaryButton>
          </Flex>
        </FilterRow>
      </SearchFilter>

      {activeTab === 'announcements' ? (
        <Section>
          <Heading3 style={{ marginBottom: theme.spacing[6] }}>
            <Bell size={20} style={{ marginRight: theme.spacing[2] }} />
            Announcements ({filteredAnnouncements.length})
          </Heading3>
          
          {filteredAnnouncements.length === 0 ? (
            <EmptyState>
              <Bell size={48} color={theme.colors.gray[300]} style={{ marginBottom: theme.spacing[4] }} />
              <Text>No announcements found matching your criteria.</Text>
            </EmptyState>
          ) : (
            <div>
              {filteredAnnouncements.map((announcement) => (
                <MessageItem key={announcement.id} type={announcement.type}>
                  <MessageHeader>
                    <MessageMeta>
                      {getTypeIcon(announcement.type)}
                      <Text size="sm" variant="muted">{announcement.author}</Text>
                      <Text size="sm" variant="muted">•</Text>
                      <Text size="sm" variant="muted">{announcement.date}</Text>
                      {announcement.pinned && <Pin size={14} color={theme.colors.primary[500]} />}
                    </MessageMeta>
                    <MessageActions>
                      {getTypeBadge(announcement.type)}
                      <SecondaryButton
                        size="sm"
                        onClick={() => togglePin(announcement.id)}
                      >
                        <Pin size={14} />
                        {announcement.pinned ? 'Unpin' : 'Pin'}
                      </SecondaryButton>
                    </MessageActions>
                  </MessageHeader>
                  
                  <Heading4 style={{ marginBottom: theme.spacing[2] }}>
                    {announcement.title}
                  </Heading4>
                  
                  <MessageContent>
                    <Text>{announcement.content}</Text>
                  </MessageContent>
                  
                  <MessageStats>
                    <StatItem>
                      <Eye size={14} color={theme.colors.gray[500]} />
                      <Text size="sm" variant="muted">{announcement.views} views</Text>
                    </StatItem>
                    <StatItem>
                      <Users size={14} color={theme.colors.gray[500]} />
                      <Text size="sm" variant="muted">
                        {announcement.recipients === 'all' ? 'All interns' : `${announcement.recipients} team`}
                      </Text>
                    </StatItem>
                  </MessageStats>
                </MessageItem>
              ))}
            </div>
          )}
        </Section>
      ) : (
        <Section>
          <Heading3 style={{ marginBottom: theme.spacing[6] }}>
            <MessageSquare size={20} style={{ marginRight: theme.spacing[2] }} />
            Recent Messages ({filteredMessages.length})
          </Heading3>
          
          {filteredMessages.length === 0 ? (
            <EmptyState>
              <MessageSquare size={48} color={theme.colors.gray[300]} style={{ marginBottom: theme.spacing[4] }} />
              <Text>No messages found matching your search.</Text>
            </EmptyState>
          ) : (
            <div>
              {filteredMessages.map((message) => (
                <MessageItem key={message.id}>
                  <MessageHeader>
                    <MessageMeta>
                      <Text size="sm" style={{ fontWeight: '500' }}>{message.author}</Text>
                      <Text size="sm" variant="muted">→</Text>
                      <Text size="sm" variant="muted">{message.recipient}</Text>
                      <Text size="sm" variant="muted">•</Text>
                      <Text size="sm" variant="muted">{message.date} at {message.time}</Text>
                    </MessageMeta>
                    <MessageActions>
                      {message.read ? (
                        <Badge variant="success">Read</Badge>
                      ) : (
                        <Badge variant="warning">Unread</Badge>
                      )}
                    </MessageActions>
                  </MessageHeader>
                  
                  <MessageContent>
                    <Text>{message.content}</Text>
                  </MessageContent>
                </MessageItem>
              ))}
            </div>
          )}
        </Section>
      )}

      {showCreateModal && (
        <CustomModal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowCreateModal(false);
          }
        }}>
          <ModalContent>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3], marginBottom: theme.spacing[6] }}>
                <div style={{ 
                  padding: theme.spacing[3], 
                  background: 'linear-gradient(135deg, #3b82f6, #1e40af)', 
                  borderRadius: theme.radius.lg,
                  color: 'white'
                }}>
                  <MessageSquare size={24} />
                </div>
                <Heading3 style={{ margin: 0 }}>Create New Announcement</Heading3>
              </div>
        
          <FormRow style={{ marginBottom: theme.spacing[4] }}>
            <div style={{ flex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
                <Text style={{ fontWeight: '600', color: theme.colors.gray[700] }}>📝 Title</Text>
              </div>
              <Input
                placeholder="Enter announcement title..."
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                style={{ 
                  border: `2px solid ${theme.colors.gray[200]}`,
                  borderRadius: theme.radius.lg,
                  padding: theme.spacing[3],
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  ':focus': {
                    borderColor: theme.colors.primary[500],
                    boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`
                  }
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
                <Text style={{ fontWeight: '600', color: theme.colors.gray[700] }}>🏷️ Type</Text>
              </div>
              <select
                value={newAnnouncement.type}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: theme.spacing[3],
                  border: `2px solid ${theme.colors.gray[200]}`,
                  borderRadius: theme.radius.lg,
                  background: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value="announcement">📢 Announcement</option>
                <option value="urgent">🚨 Urgent</option>
                <option value="info">ℹ️ Information</option>
              </select>
            </div>
          </FormRow>

          <div style={{ marginBottom: theme.spacing[4] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
              <Text style={{ fontWeight: '600', color: theme.colors.gray[700] }}>📄 Content</Text>
            </div>
            <Textarea
              rows={4}
              placeholder="Write your announcement content..."
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              style={{ 
                border: `2px solid ${theme.colors.gray[200]}`,
                borderRadius: theme.radius.lg,
                padding: theme.spacing[3],
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
          </div>

          <FormRow style={{ marginBottom: theme.spacing[4] }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
                <Users size={16} color={theme.colors.primary[600]} />
                <Text style={{ fontWeight: '600', color: theme.colors.gray[700] }}>Recipients</Text>
              </div>
              <select
                value={newAnnouncement.recipients}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, recipients: e.target.value, specificRecipient: ''})}
                style={{
                  width: '100%',
                  padding: theme.spacing[3],
                  border: `2px solid ${theme.colors.gray[200]}`,
                  borderRadius: theme.radius.lg,
                  background: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value="all">👥 All Interns</option>
                <option value="development">💻 Development Team</option>
                <option value="design">🎨 Design Team</option>
                <option value="marketing">📈 Marketing Team</option>
                <option value="individual">👤 Specific Intern</option>
              </select>
            </div>

            {newAnnouncement.recipients === 'individual' && (
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
                  <Text style={{ fontWeight: '600', color: theme.colors.gray[700] }}>Select Intern</Text>
                </div>
                <select
                  value={newAnnouncement.specificRecipient}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, specificRecipient: e.target.value})}
                  style={{
                    width: '100%',
                    padding: theme.spacing[3],
                    border: `2px solid ${theme.colors.gray[200]}`,
                    borderRadius: theme.radius.lg,
                    background: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <option value="">Choose an intern...</option>
                  {interns.map((intern) => (
                    <option key={intern.id} value={intern.id}>
                      {intern.name} ({intern.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </FormRow>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: theme.spacing[6],
            padding: theme.spacing[4],
            background: `linear-gradient(135deg, ${theme.colors.primary[50]}, ${theme.colors.primary[100]})`,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.primary[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
              <Pin size={20} color={theme.colors.primary[600]} />
              <Text style={{ fontWeight: '600', color: theme.colors.primary[700] }}>Pin this announcement</Text>
              <Text style={{ fontSize: '0.875rem', color: theme.colors.primary[600] }}>
                (Pinned announcements appear at the top)
              </Text>
            </div>
            <label style={{ 
              position: 'relative', 
              display: 'inline-block', 
              width: '48px', 
              height: '24px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={newAnnouncement.pinned}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, pinned: e.target.checked})}
                style={{ 
                  opacity: 0, 
                  width: 0, 
                  height: 0 
                }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: newAnnouncement.pinned ? theme.colors.primary[500] : theme.colors.gray[300],
                borderRadius: '24px',
                transition: '0.3s',
                ':before': {
                  content: '""',
                  position: 'absolute',
                  height: '18px',
                  width: '18px',
                  left: newAnnouncement.pinned ? '27px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }
              }}>
                <span style={{
                  content: '""',
                  position: 'absolute',
                  height: '18px',
                  width: '18px',
                  left: newAnnouncement.pinned ? '27px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
              </span>
            </label>
          </div>

          <Flex justify="end" gap={theme.spacing[3]}>
            <SecondaryButton 
              onClick={() => setShowCreateModal(false)}
              style={{ 
                padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
                borderRadius: theme.radius.lg,
                fontWeight: '600'
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton 
              onClick={createAnnouncement}
              disabled={!newAnnouncement.title || !newAnnouncement.content || (newAnnouncement.recipients === 'individual' && !newAnnouncement.specificRecipient)}
              style={{ 
                padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
                borderRadius: theme.radius.lg,
                fontWeight: '600',
                background: newAnnouncement.title && newAnnouncement.content ? 
                  'linear-gradient(135deg, #3b82f6, #1e40af)' : 
                  theme.colors.gray[400],
                boxShadow: newAnnouncement.title && newAnnouncement.content ? 
                  '0 4px 16px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              <Send size={16} />
              Create Announcement
            </PrimaryButton>
          </Flex>
            </div>
          </ModalContent>
        </CustomModal>
      )}
    </Container>
        </MainContent>
      </div>
  );
};

export default MessagesAnnouncements_New;
