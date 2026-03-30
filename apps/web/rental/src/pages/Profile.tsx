import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { User, Save } from 'lucide-react';

export function Profile() {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setPhotoURL(profile.photoURL || '');
    }
  }, [profile]);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-500">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-full h-full p-4 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.displayName}</h2>
              <p className="text-gray-500">{profile.email}</p>
              <span className="inline-block mt-2 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                {profile.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">Email address cannot be changed.</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving || (displayName === profile.displayName && photoURL === (profile.photoURL || ''))}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
