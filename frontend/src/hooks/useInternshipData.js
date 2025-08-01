import { useState, useEffect } from 'react';

// Sample data for demonstration
const initialInterns = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Frontend Developer',
    taskStatus: 'In Progress',
    attendance: 95,
    joinDate: '2025-01-15',
    folderLink: 'https://drive.google.com/folder/intern-sarah'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    role: 'Backend Developer',
    taskStatus: 'Completed',
    attendance: 88,
    joinDate: '2025-01-20',
    folderLink: 'https://drive.google.com/folder/intern-mike'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'UI/UX Designer',
    taskStatus: 'Pending',
    attendance: 92,
    joinDate: '2025-02-01',
    folderLink: ''
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@example.com',
    role: 'Data Analyst',
    taskStatus: 'In Progress',
    attendance: 85,
    joinDate: '2025-02-05',
    folderLink: 'https://drive.google.com/folder/intern-alex'
  }
];

const initialTasks = [
  {
    id: 1,
    internId: 1,
    internName: 'Sarah Johnson',
    title: 'Create Landing Page',
    description: 'Design and develop a responsive landing page for the company website',
    deadline: '2025-08-15',
    status: 'In Progress',
    submissionLink: 'https://github.com/sarah/landing-page',
    assignedDate: '2025-07-20',
    feedback: ''
  },
  {
    id: 2,
    internId: 2,
    internName: 'Mike Chen',
    title: 'API Integration',
    description: 'Integrate payment gateway API with the existing system',
    deadline: '2025-08-10',
    status: 'Completed',
    submissionLink: 'https://github.com/mike/api-integration',
    assignedDate: '2025-07-15',
    feedback: 'Excellent work! Clean code and well documented.'
  },
  {
    id: 3,
    internId: 3,
    internName: 'Emily Davis',
    title: 'User Research',
    description: 'Conduct user interviews and create user personas',
    deadline: '2025-08-20',
    status: 'Pending',
    submissionLink: '',
    assignedDate: '2025-07-25',
    feedback: ''
  }
];

const initialMessages = [
  {
    id: 1,
    type: 'broadcast',
    sender: 'Admin',
    receiver: 'All Interns',
    content: 'Welcome to the new internship program! Please check your tasks and deadlines.',
    timestamp: '2025-07-24T10:00:00Z',
    isRead: true
  },
  {
    id: 2,
    type: 'individual',
    sender: 'Admin',
    receiver: 'Sarah Johnson',
    content: 'Great progress on the landing page! Please add responsive design for mobile.',
    timestamp: '2025-07-24T14:30:00Z',
    isRead: true
  },
  {
    id: 3,
    type: 'received',
    sender: 'Mike Chen',
    receiver: 'Admin',
    content: 'I have completed the API integration task. Please review when you have time.',
    timestamp: '2025-07-24T16:45:00Z',
    isRead: false
  }
];

const initialAttendance = [
  {
    id: 1,
    internId: 1,
    internName: 'Sarah Johnson',
    date: '2025-07-24',
    status: 'Present'
  },
  {
    id: 2,
    internId: 2,
    internName: 'Mike Chen',
    date: '2025-07-24',
    status: 'Present'
  },
  {
    id: 3,
    internId: 3,
    internName: 'Emily Davis',
    date: '2025-07-24',
    status: 'Absent'
  },
  {
    id: 4,
    internId: 4,
    internName: 'Alex Rodriguez',
    date: '2025-07-24',
    status: 'Present'
  }
];

export const useInternshipData = () => {
  const [interns, setInterns] = useState(initialInterns);
  const [tasks, setTasks] = useState(initialTasks);
  const [messages, setMessages] = useState(initialMessages);
  const [attendance, setAttendance] = useState(initialAttendance);

  // Intern management
  const addIntern = (internData) => {
    const newIntern = {
      id: interns.length + 1,
      ...internData,
      taskStatus: 'Pending',
      attendance: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setInterns([...interns, newIntern]);
  };

  const updateIntern = (id, updatedData) => {
    setInterns(interns.map(intern => 
      intern.id === id ? { ...intern, ...updatedData } : intern
    ));
  };

  const deleteIntern = (id) => {
    setInterns(interns.filter(intern => intern.id !== id));
    setTasks(tasks.filter(task => task.internId !== id));
    setAttendance(attendance.filter(record => record.internId !== id));
  };

  // Task management
  const addTask = (taskData) => {
    const intern = interns.find(i => i.id === parseInt(taskData.internId));
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      internName: intern?.name || '',
      status: 'Pending',
      assignedDate: new Date().toISOString().split('T')[0],
      submissionLink: '',
      feedback: ''
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updatedData) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedData } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Message management
  const addMessage = (messageData) => {
    const newMessage = {
      id: messages.length + 1,
      ...messageData,
      sender: 'Admin',
      timestamp: new Date().toISOString(),
      isRead: true
    };
    setMessages([...messages, newMessage]);
  };

  const markMessageAsRead = (id) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, isRead: true } : message
    ));
  };

  // Attendance management
  const markAttendance = (attendanceData) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedAttendance = attendanceData.map(record => ({
      id: attendance.length + Math.random(),
      internId: record.internId,
      internName: record.internName,
      date: today,
      status: record.status
    }));
    
    // Remove existing attendance for today and add new records
    const filteredAttendance = attendance.filter(record => record.date !== today);
    setAttendance([...filteredAttendance, ...updatedAttendance]);
  };

  // Statistics
  const getStats = () => {
    const totalInterns = interns.length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const averageAttendance = interns.reduce((acc, intern) => acc + intern.attendance, 0) / totalInterns || 0;
    const unreadMessages = messages.filter(message => !message.isRead && message.type === 'received').length;

    return {
      totalInterns,
      pendingTasks,
      completedTasks,
      averageAttendance: Math.round(averageAttendance),
      unreadMessages
    };
  };

  return {
    interns,
    tasks,
    messages,
    attendance,
    addIntern,
    updateIntern,
    deleteIntern,
    addTask,
    updateTask,
    deleteTask,
    addMessage,
    markMessageAsRead,
    markAttendance,
    getStats
  };
};
