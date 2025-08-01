import React, { useState } from 'react';
import { Users, Search, Plus, Edit, Trash2, ExternalLink, Filter, Calendar } from 'lucide-react';
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
  GhostButton,
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

const SearchAndFilter = styled(GlassCard)`
  margin-bottom: ${theme.spacing[6]};
  padding: ${theme.spacing[4]};
`;

const SearchRow = styled(Flex)`
  gap: ${theme.spacing[4]};
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InternsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing[6]};
`;

const InternCard = styled(GlassCard)`
  padding: ${theme.spacing[6]};
  position: relative;
  overflow: visible;
`;

const InternHeader = styled(Flex)`
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const InternAvatar = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  border-radius: ${theme.radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const ActionButtons = styled(Flex)`
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[4]};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${theme.radius.lg};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: ${theme.colors.primary[50]};
          color: ${theme.colors.primary[600]};
          &:hover {
            background: ${theme.colors.primary[100]};
            border-color: ${theme.colors.primary[200]};
          }
        `;
      case 'delete':
        return `
          background: ${theme.colors.error[50]};
          color: ${theme.colors.error[600]};
          &:hover {
            background: ${theme.colors.error[100]};
            border-color: ${theme.colors.error[200]};
          }
        `;
      case 'view':
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[600]};
          &:hover {
            background: ${theme.colors.gray[200]};
            border-color: ${theme.colors.gray[300]};
          }
        `;
      default:
        return '';
    }
  }}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing[4]};
`;

const ModalContent = styled(GlassCard)`
  width: 100%;
  max-width: 500px;
  padding: ${theme.spacing[8]};
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[2]};
  font-size: 0.875rem;
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: ${theme.radius.lg};
  font-family: inherit;
  font-size: 0.875rem;
  color: ${theme.colors.gray[800]};
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }
`;

const ModalActions = styled(Flex)`
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[6]};
  justify-content: flex-end;
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

const ManageInterns_New = () => {
  const { interns, addIntern, updateIntern, deleteIntern } = useInternshipData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    folderLink: '',
    startDate: '',
    endDate: ''
  });

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Data Analyst',
    'Mobile Developer',
    'DevOps Engineer'
  ];

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || intern.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIntern) {
      updateIntern(selectedIntern.id, formData);
      setIsEditModalOpen(false);
    } else {
      addIntern(formData);
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: '', folderLink: '', startDate: '', endDate: '' });
    setSelectedIntern(null);
  };

  const openEditModal = (intern) => {
    setSelectedIntern(intern);
    setFormData({
      name: intern.name,
      email: intern.email,
      role: intern.role,
      folderLink: intern.folderLink || '',
      startDate: intern.startDate ? intern.startDate.split('T')[0] : '',
      endDate: intern.endDate ? intern.endDate.split('T')[0] : ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (intern) => {
    setSelectedIntern(intern);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteIntern(selectedIntern.id);
    setIsDeleteModalOpen(false);
    setSelectedIntern(null);
  };

  const stats = {
    total: interns.length,
    active: interns.filter(i => i.taskStatus === 'In Progress' || i.taskStatus === 'Completed').length,
    completed: interns.filter(i => i.taskStatus === 'Completed').length,
    pending: interns.filter(i => i.taskStatus === 'Pending').length
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Sidebar />
      <MainContent>
        <Container>
          <PageHeader>
            <div>
              <Heading1>Manage Interns</Heading1>
              <Text variant="secondary">Add, edit, and manage your internship program participants.</Text>
            </div>
            <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              Add New Intern
            </PrimaryButton>
          </PageHeader>

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
            {stats.active}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Active
          </Text>
        </StatItem>
        
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.primary[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.completed}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Completed
          </Text>
        </StatItem>
        
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.warning[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.pending}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Pending
          </Text>
        </StatItem>
      </StatsRow>

      <SearchAndFilter>
        <SearchRow>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: theme.spacing[4], 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: theme.colors.gray[400]
              }} 
            />
            <Input
              type="text"
              placeholder="Search interns by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          
          <div style={{ minWidth: '200px' }}>
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Select>
          </div>
        </SearchRow>
      </SearchAndFilter>

      {filteredInterns.length === 0 ? (
        <GlassCard style={{ textAlign: 'center', padding: theme.spacing[12] }}>
          <Users size={48} color={theme.colors.gray[400]} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
          <Heading3 style={{ color: theme.colors.gray[600] }}>No interns found</Heading3>
          <Text variant="muted">
            {searchTerm || roleFilter !== 'all' 
              ? 'Try adjusting your search criteria.' 
              : 'Start by adding your first intern to the program.'
            }
          </Text>
        </GlassCard>
      ) : (
        <InternsGrid>
          {filteredInterns.map((intern) => (
            <InternCard key={intern.id}>
              <InternHeader>
                <InternAvatar>
                  {intern.name.split(' ').map(n => n[0]).join('')}
                </InternAvatar>
                <div style={{ flex: 1 }}>
                  <Heading4 style={{ margin: 0, marginBottom: theme.spacing[1] }}>
                    {intern.name}
                  </Heading4>
                  <Text size="sm" variant="muted" noMargin>
                    {intern.email}
                  </Text>
                </div>
              </InternHeader>

              <div style={{ marginBottom: theme.spacing[4] }}>
                <Text size="sm" variant="secondary" style={{ marginBottom: theme.spacing[2] }}>
                  <strong>Role:</strong> {intern.role}
                </Text>
                <Badge 
                  variant={
                    intern.taskStatus === 'Completed' ? 'success' :
                    intern.taskStatus === 'In Progress' ? 'warning' :
                    'neutral'
                  }
                >
                  {intern.taskStatus}
                </Badge>
              </div>

              <ActionButtons>
                <ActionButton 
                  variant="view" 
                  onClick={() => window.open(intern.folderLink, '_blank')}
                  title="View Folder"
                >
                  <ExternalLink size={16} />
                </ActionButton>
                <ActionButton 
                  variant="edit" 
                  onClick={() => openEditModal(intern)}
                  title="Edit Intern"
                >
                  <Edit size={16} />
                </ActionButton>
                <ActionButton 
                  variant="delete" 
                  onClick={() => openDeleteModal(intern)}
                  title="Delete Intern"
                >
                  <Trash2 size={16} />
                </ActionButton>
              </ActionButtons>
            </InternCard>
          ))}
        </InternsGrid>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <Modal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}>
          <ModalContent>
            <Heading3 style={{ marginBottom: theme.spacing[6] }}>
              {selectedIntern ? 'Edit Intern' : 'Add New Intern'}
            </Heading3>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter intern's full name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Internship Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Internship End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Folder Link (Optional)</Label>
                <Input
                  type="url"
                  value={formData.folderLink}
                  onChange={(e) => setFormData({ ...formData, folderLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </FormGroup>

              <ModalActions>
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit">
                  {selectedIntern ? 'Update Intern' : 'Add Intern'}
                </PrimaryButton>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsDeleteModalOpen(false);
            setSelectedIntern(null);
          }
        }}>
          <ModalContent style={{ textAlign: 'center' }}>
            <Trash2 size={48} color={theme.colors.error[500]} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
            <Heading3 style={{ marginBottom: theme.spacing[4] }}>Delete Intern</Heading3>
            <Text style={{ marginBottom: theme.spacing[6] }}>
              Are you sure you want to delete <strong>{selectedIntern?.name}</strong>? 
              This action cannot be undone.
            </Text>
            
            <ModalActions style={{ justifyContent: 'center' }}>
              <SecondaryButton
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedIntern(null);
                }}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={confirmDelete}
                style={{ 
                  background: `linear-gradient(135deg, ${theme.colors.error[500]}, ${theme.colors.error[600]})`,
                  boxShadow: `0 4px 16px ${theme.colors.error[500]}30`
                }}
              >
                Delete Intern
              </PrimaryButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </Container>
        </MainContent>
      </div>
  );
};

export default ManageInterns_New;
