import React, { useState } from 'react';
import { Plus, Calendar, ExternalLink, Edit, Trash2, ClipboardList, Clock, User, AlertTriangle } from 'lucide-react';
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
  TextArea,
  theme
} from '../components/styled/StyledComponents';
import { useInternshipData } from '../hooks/useInternshipData';

const PageHeader = styled(Flex)`
  margin-bottom: ${theme.spacing[6]};
  align-items: flex-start;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing[4]};
  }
`;

const TasksGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${theme.spacing[6]};
`;

const TaskCard = styled(GlassCard)`
  padding: ${theme.spacing[6]};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.priority) {
        case 'High': return `linear-gradient(90deg, ${theme.colors.error[500]}, ${theme.colors.error[600]})`;
        case 'Medium': return `linear-gradient(90deg, ${theme.colors.warning[500]}, ${theme.colors.warning[600]})`;
        case 'Low': return `linear-gradient(90deg, ${theme.colors.success[500]}, ${theme.colors.success[600]})`;
        default: return `linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]})`;
      }
    }};
    border-radius: ${theme.radius.xl} ${theme.radius.xl} 0 0;
  }
`;

const TaskHeader = styled(Flex)`
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[4]};
`;

const TaskMeta = styled(Flex)`
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
  flex-wrap: wrap;
`;

const MetaItem = styled(Flex)`
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: 0.875rem;
  color: ${theme.colors.gray[600]};
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
  max-width: 600px;
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

const EmptyState = styled(GlassCard)`
  text-align: center;
  padding: ${theme.spacing[12]};
`;

const FilterSection = styled(GlassCard)`
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const FilterRow = styled(Flex)`
  gap: ${theme.spacing[4]};
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const AssignTasks = () => {
  const { interns, tasks, addTask, updateTask, deleteTask } = useInternshipData();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  const [formData, setFormData] = useState({
    internId: '',
    title: '',
    description: '',
    deadline: '',
    submissionLink: '',
    priority: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setShowModal(false);
    setEditingTask(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      internId: '',
      title: '',
      description: '',
      deadline: '',
      submissionLink: '',
      priority: 'Medium'
    });
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      internId: task.internId,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      submissionLink: task.submissionLink || '',
      priority: task.priority
    });
    setShowModal(true);
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteTask(taskToDelete.id);
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const getInternName = (internId) => {
    const intern = interns.find(i => i.id === internId);
    return intern ? intern.name : 'Unknown Intern';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => isOverdue(t.deadline) && t.status !== 'Completed').length
  };

  return (
    <Container>
      <PageHeader>
        <div>
          <Heading1>Assign Tasks</Heading1>
          <Text variant="secondary">Create and manage tasks for your interns.</Text>
        </div>
        <PrimaryButton onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Create New Task
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
            {stats.total}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Total Tasks
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
        
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.primary[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.inProgress}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            In Progress
          </Text>
        </StatItem>
        
        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.success[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.completed}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Completed
          </Text>
        </StatItem>

        <StatItem>
          <Text style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.error[600], marginBottom: theme.spacing[1] }} noMargin>
            {stats.overdue}
          </Text>
          <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
            Overdue
          </Text>
        </StatItem>
      </StatsRow>

      <FilterSection>
        <FilterRow>
          <div style={{ flex: 1 }}>
            <Label>Filter by Status</Label>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
          
          <div style={{ flex: 1 }}>
            <Label>Filter by Priority</Label>
            <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Select>
          </div>
        </FilterRow>
      </FilterSection>

      {filteredTasks.length === 0 ? (
        <EmptyState>
          <ClipboardList size={48} color={theme.colors.gray[400]} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
          <Heading3 style={{ color: theme.colors.gray[600] }}>No tasks found</Heading3>
          <Text variant="muted">
            {filterStatus !== 'all' || filterPriority !== 'all' 
              ? 'Try adjusting your filter criteria.' 
              : 'Start by creating your first task for the interns.'
            }
          </Text>
        </EmptyState>
      ) : (
        <TasksGrid>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} priority={task.priority}>
              <TaskHeader>
                <div style={{ flex: 1 }}>
                  <Heading4 style={{ margin: 0, marginBottom: theme.spacing[2] }}>
                    {task.title}
                  </Heading4>
                  <Badge 
                    variant={
                      task.priority === 'High' ? 'error' :
                      task.priority === 'Medium' ? 'warning' :
                      'success'
                    }
                  >
                    {task.priority} Priority
                  </Badge>
                </div>
              </TaskHeader>

              <Text size="sm" style={{ marginBottom: theme.spacing[4] }}>
                {task.description}
              </Text>

              <TaskMeta>
                <MetaItem>
                  <User size={16} />
                  <span>{getInternName(task.internId)}</span>
                </MetaItem>
                
                <MetaItem>
                  <Calendar size={16} />
                  <span>Due: {formatDate(task.deadline)}</span>
                  {isOverdue(task.deadline) && task.status !== 'Completed' && (
                    <AlertTriangle size={16} color={theme.colors.error[500]} />
                  )}
                </MetaItem>
              </TaskMeta>

              <div style={{ marginBottom: theme.spacing[4] }}>
                <Badge 
                  variant={
                    task.status === 'Completed' ? 'success' :
                    task.status === 'In Progress' ? 'primary' :
                    'neutral'
                  }
                >
                  {task.status}
                </Badge>
              </div>

              <ActionButtons>
                {task.submissionLink && (
                  <ActionButton 
                    variant="view" 
                    onClick={() => window.open(task.submissionLink, '_blank')}
                    title="View Submission"
                  >
                    <ExternalLink size={16} />
                  </ActionButton>
                )}
                <ActionButton 
                  variant="edit" 
                  onClick={() => openEditModal(task)}
                  title="Edit Task"
                >
                  <Edit size={16} />
                </ActionButton>
                <ActionButton 
                  variant="delete" 
                  onClick={() => openDeleteModal(task)}
                  title="Delete Task"
                >
                  <Trash2 size={16} />
                </ActionButton>
              </ActionButtons>
            </TaskCard>
          ))}
        </TasksGrid>
      )}

      {/* Add/Edit Task Modal */}
      {showModal && (
        <Modal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowModal(false);
            setEditingTask(null);
            resetForm();
          }
        }}>
          <ModalContent>
            <Heading3 style={{ marginBottom: theme.spacing[6] }}>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </Heading3>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Assign to Intern</Label>
                <Select
                  value={formData.internId}
                  onChange={(e) => setFormData({ ...formData, internId: e.target.value })}
                  required
                >
                  <option value="">Select an intern</option>
                  {interns.map(intern => (
                    <option key={intern.id} value={intern.id}>
                      {intern.name} - {intern.role}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Task Title</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the task requirements and expectations..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Priority Level</Label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Submission Link (Optional)</Label>
                <Input
                  type="url"
                  value={formData.submissionLink}
                  onChange={(e) => setFormData({ ...formData, submissionLink: e.target.value })}
                  placeholder="https://..."
                />
              </FormGroup>

              <ModalActions>
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </PrimaryButton>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowDeleteModal(false);
            setTaskToDelete(null);
          }
        }}>
          <ModalContent style={{ textAlign: 'center' }}>
            <Trash2 size={48} color={theme.colors.error[500]} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
            <Heading3 style={{ marginBottom: theme.spacing[4] }}>Delete Task</Heading3>
            <Text style={{ marginBottom: theme.spacing[6] }}>
              Are you sure you want to delete "<strong>{taskToDelete?.title}</strong>"? 
              This action cannot be undone.
            </Text>
            
            <ModalActions style={{ justifyContent: 'center' }}>
              <SecondaryButton
                onClick={() => {
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
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
                Delete Task
              </PrimaryButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AssignTasks;
