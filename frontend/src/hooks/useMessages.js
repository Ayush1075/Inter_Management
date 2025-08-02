import { useState, useEffect } from 'react';
import axios from 'axios';

const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages');
      setMessages(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.response?.data?.msg || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  // Create new announcement/message
  const createMessage = async (messageData) => {
    try {
      const response = await axios.post('/api/messages', messageData);
      setMessages(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating message:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Failed to create message' 
      };
    }
  };

  // Update message
  const updateMessage = async (id, updateData) => {
    try {
      const response = await axios.put(`/api/messages/${id}`, updateData);
      setMessages(prev => 
        prev.map(msg => msg._id === id ? response.data : msg)
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating message:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Failed to update message' 
      };
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    try {
      await axios.delete(`/api/messages/${id}`);
      setMessages(prev => prev.filter(msg => msg._id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting message:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Failed to delete message' 
      };
    }
  };

  // Toggle pin status
  const togglePin = async (id) => {
    try {
      const response = await axios.put(`/api/messages/${id}/toggle-pin`);
      setMessages(prev => 
        prev.map(msg => msg._id === id ? response.data : msg)
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error toggling pin:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Failed to toggle pin' 
      };
    }
  };

  // Mark message as read
  const markAsRead = async (id) => {
    try {
      const response = await axios.put(`/api/messages/${id}/mark-read`);
      setMessages(prev => 
        prev.map(msg => msg._id === id ? response.data : msg)
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error marking as read:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Failed to mark as read' 
      };
    }
  };

  // Fetch admin messages (all messages)
  const fetchAdminMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages/admin');
      setMessages(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin messages:', err);
      setError(err.response?.data?.msg || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    togglePin,
    markAsRead,
    fetchAdminMessages
  };
};

export default useMessages; 