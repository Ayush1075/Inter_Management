import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Download, Upload, Filter } from 'lucide-react';
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

const AttendanceGrid = styled(Grid)`
  grid-template-columns: 1fr;
  gap: ${theme.spacing[6]};
`;

const AttendanceCard = styled(GlassCard)`
  padding: ${theme.spacing[6]};
`;

const InternRow = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[4]};
  background: rgba(248, 250, 252, 0.5);
  border-radius: ${theme.radius.lg};
  margin-bottom: ${theme.spacing[3]};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(241, 245, 249, 0.8);
  }
`;

const InternInfo = styled(Flex)`
  align-items: center;
  gap: ${theme.spacing[4]};
  flex: 1;
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

const AttendanceButtons = styled(Flex)`
  gap: ${theme.spacing[2]};
`;

const AttendanceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.radius.lg};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.variant) {
      case 'present':
        return `
          background: ${props.active ? theme.colors.success[500] : theme.colors.success[50]};
          color: ${props.active ? 'white' : theme.colors.success[600]};
          border-color: ${props.active ? theme.colors.success[500] : theme.colors.success[200]};
          &:hover {
            background: ${theme.colors.success[props.active ? 600 : 100]};
            border-color: ${theme.colors.success[props.active ? 600 : 300]};
          }
        `;
      case 'absent':
        return `
          background: ${props.active ? theme.colors.error[500] : theme.colors.error[50]};
          color: ${props.active ? 'white' : theme.colors.error[600]};
          border-color: ${props.active ? theme.colors.error[500] : theme.colors.error[200]};
          &:hover {
            background: ${theme.colors.error[props.active ? 600 : 100]};
            border-color: ${theme.colors.error[props.active ? 600 : 300]};
          }
        `;
      case 'late':
        return `
          background: ${props.active ? theme.colors.warning[500] : theme.colors.warning[50]};
          color: ${props.active ? 'white' : theme.colors.warning[600]};
          border-color: ${props.active ? theme.colors.warning[500] : theme.colors.warning[200]};
          &:hover {
            background: ${theme.colors.warning[props.active ? 600 : 100]};
            border-color: ${theme.colors.warning[props.active ? 600 : 300]};
          }
        `;
      default:
        return '';
    }
  }}
`;

const DateSelector = styled(GlassCard)`
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const DateRow = styled(Flex)`
  gap: ${theme.spacing[4]};
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StatsRow = styled(Flex)`
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing[4]};
  }
`;

const StatItem = styled(GlassCard)`
  padding: ${theme.spacing[4]};
  text-align: center;
  flex: 1;
`;

const ActionBar = styled(Flex)`
  gap: ${theme.spacing[3]};
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const EmptyState = styled(GlassCard)`
  text-align: center;
  padding: ${theme.spacing[12]};
`;

const MarkAttendance_New = () => {
  const { interns } = useInternshipData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);

  const handleAttendanceChange = (internId, status) => {
    setAttendance(prev => ({
      ...prev,
      [internId]: status
    }));
    setSaved(false);
  };

  const saveAttendance = () => {
    // Here you would typically save to your backend
    console.log('Saving attendance for', selectedDate, ':', attendance);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getTodayStats = () => {
    const totalInterns = interns.length;
    const markedAttendance = Object.keys(attendance).length;
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const late = Object.values(attendance).filter(status => status === 'late').length;

    return {
      total: totalInterns,
      marked: markedAttendance,
      present,
      absent,
      late,
      pending: totalInterns - markedAttendance
    };
  };

  const stats = getTodayStats();

  const exportAttendance = () => {
    // Create CSV data
    const csvData = interns.map(intern => ({
      Name: intern.name,
      Email: intern.email,
      Role: intern.role,
      Date: selectedDate,
      Status: attendance[intern.id] || 'Not Marked'
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csvString = [headers, ...rows].join('\n');

    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Sidebar />
      <MainContent>
        <Container>
          <PageHeader>
            <div>
              <Heading1>Mark Attendance</Heading1>
              <Text variant="secondary">Track daily attendance for all interns in your program.</Text>
            </div>
            <ActionBar>
              <SecondaryButton onClick={exportAttendance}>
                <Download size={20} />
                Export CSV
              </SecondaryButton>
              <PrimaryButton onClick={saveAttendance} disabled={Object.keys(attendance).length === 0}>
                {saved ? <CheckCircle size={20} /> : <Upload size={20} />}
                {saved ? 'Saved!' : 'Save Attendance'}
              </PrimaryButton>
        </ActionBar>
      </PageHeader>

      <DateSelector>
        <DateRow>
          <div style={{ flex: 1 }}>
            <Text style={{ fontWeight: '500', marginBottom: theme.spacing[2] }}>
              Select Date
            </Text>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setAttendance({});
                setSaved(false);
              }}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div style={{ flex: 2 }}>
            <Text variant="muted" size="sm">
              Selected Date
            </Text>
            <Heading3 style={{ margin: 0, color: theme.colors.primary[600] }}>
              {formatDate(selectedDate)}
              {isToday && (
                <Badge variant="primary" style={{ marginLeft: theme.spacing[2] }}>
                  Today
                </Badge>
              )}
            </Heading3>
          </div>
        </DateRow>
      </DateSelector>

      <StatsRow>
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
            {stats.total}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Total Interns
          </Text>
        </StatItem>
        
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.success[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.present}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Present
          </Text>
        </StatItem>
        
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.error[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.absent}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Absent
          </Text>
        </StatItem>
        
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.warning[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.late}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Late
          </Text>
        </StatItem>

        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.gray[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.pending}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Pending
          </Text>
        </StatItem>
      </StatsRow>

      {interns.length === 0 ? (
        <EmptyState>
          <Users size={48} color={theme.colors.gray[400]} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
          <Heading3 style={{ color: theme.colors.gray[600] }}>No interns found</Heading3>
          <Text variant="muted">
            Add some interns to your program first before marking attendance.
          </Text>
        </EmptyState>
      ) : (
        <AttendanceGrid>
          <AttendanceCard>
            <Heading3 style={{ marginBottom: theme.spacing[6] }}>
              <Calendar size={20} style={{ marginRight: theme.spacing[2] }} />
              Attendance for {formatDate(selectedDate)}
            </Heading3>
            
            <div>
              {interns.map((intern) => (
                <InternRow key={intern.id}>
                  <InternInfo>
                    <InternAvatar>
                      {intern.name.split(' ').map(n => n[0]).join('')}
                    </InternAvatar>
                    <div>
                      <Text style={{ fontWeight: '500', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
                        {intern.name}
                      </Text>
                      <Text size="sm" variant="muted" noMargin>
                        {intern.role} • {intern.email}
                      </Text>
                    </div>
                  </InternInfo>
                  
                  <AttendanceButtons>
                    <AttendanceButton
                      variant="present"
                      active={attendance[intern.id] === 'present'}
                      onClick={() => handleAttendanceChange(intern.id, 'present')}
                    >
                      <CheckCircle size={16} />
                      Present
                    </AttendanceButton>
                    
                    <AttendanceButton
                      variant="late"
                      active={attendance[intern.id] === 'late'}
                      onClick={() => handleAttendanceChange(intern.id, 'late')}
                    >
                      <Clock size={16} />
                      Late
                    </AttendanceButton>
                    
                    <AttendanceButton
                      variant="absent"
                      active={attendance[intern.id] === 'absent'}
                      onClick={() => handleAttendanceChange(intern.id, 'absent')}
                    >
                      <XCircle size={16} />
                      Absent
                    </AttendanceButton>
                  </AttendanceButtons>
                </InternRow>
              ))}
            </div>

            {Object.keys(attendance).length > 0 && (
              <Flex justify="center" style={{ marginTop: theme.spacing[6] }}>
                <PrimaryButton onClick={saveAttendance} size="lg">
                  {saved ? (
                    <>
                      <CheckCircle size={20} />
                      Attendance Saved Successfully!
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Save Attendance for {formatDate(selectedDate)}
                    </>
                  )}
                </PrimaryButton>
              </Flex>
            )}
          </AttendanceCard>
        </AttendanceGrid>
      )}
    </Container>
        </MainContent>
      </div>
  );
};

export default MarkAttendance_New;
