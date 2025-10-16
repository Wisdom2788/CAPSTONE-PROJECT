import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: {
      state: '',
      city: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          location: {
            state: userData.location.state,
            city: userData.location.city
          }
        });
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        location: {
          state: user.location.state,
          city: user.location.city
        }
      });
    }
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await updateUserProfile(formData);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      setEditing(false);
      
      // Update auth context
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 slide-in-right">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 fade-in">
      <div className="slide-up">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary">
          My Profile
        </h1>
        <p className="mt-1 sm:mt-2 text-text-secondary text-base sm:text-lg">
          View and manage your personal information.
        </p>
      </div>

      <div className="card p-4 sm:p-6 md:p-8 slide-up animation-delay-100">
        {user ? (
          <div className="space-y-4 sm:space-y-6">
            {!editing ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="card p-4 sm:p-6">
                    <p className="text-text-secondary text-sm sm:text-base">First Name</p>
                    <p className="text-lg sm:text-xl font-semibold text-text-primary mt-1">{user.firstName}</p>
                  </div>
                  <div className="card p-4 sm:p-6">
                    <p className="text-text-secondary text-sm sm:text-base">Last Name</p>
                    <p className="text-lg sm:text-xl font-semibold text-text-primary mt-1">{user.lastName}</p>
                  </div>
                </div>
                <div className="card p-4 sm:p-6">
                  <p className="text-text-secondary text-sm sm:text-base">Email</p>
                  <p className="text-lg sm:text-xl font-semibold text-text-primary mt-1">{user.email}</p>
                </div>
                <div className="card p-4 sm:p-6">
                  <p className="text-text-secondary text-sm sm:text-base">Phone Number</p>
                  <p className="text-lg sm:text-xl font-semibold text-text-primary mt-1">{user.phoneNumber}</p>
                </div>
                <div className="card p-4 sm:p-6">
                  <p className="text-text-secondary text-sm sm:text-base">Location</p>
                  <p className="text-lg sm:text-xl font-semibold text-text-primary mt-1">{user.location.city}, {user.location.state}</p>
                </div>
                <div className="card p-4 sm:p-6">
                  <p className="text-text-secondary text-sm sm:text-base">Member Since</p>
                  <p className="text-lg sm:text-xl font-semibold text-text-primary mt-1">{new Date(user.createdAt || '').toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={handleEdit}
                  className="btn-primary mt-4"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1 sm:mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1 sm:mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1 sm:mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1 sm:mb-2">State</label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1 sm:mb-2">City</label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center">
                        <span className="loading-spinner mr-2 w-4 h-4 border-2"></span>
                        <span className="text-sm sm:text-base">Saving...</span>
                      </span>
                    ) : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;