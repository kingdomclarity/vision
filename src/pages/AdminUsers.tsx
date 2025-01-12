import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Shield, Star, Ban, Check } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', profile.id);

          return {
            ...profile,
            roles: roles?.map(r => r.role_id) || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRole(userId: string, role: string, hasRole: boolean) {
    try {
      if (hasRole) {
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role_id', role);
      } else {
        await supabase
          .from('user_roles')
          .insert({ user_id: userId, role_id: role });
      }

      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }

  async function toggleVerification(userId: string, isVerified: boolean) {
    try {
      await supabase
        .from('profiles')
        .update({ is_verified: !isVerified })
        .eq('id', userId);

      loadUsers();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-gold-500" />
        <h1 className="text-3xl font-medium">User Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Joined</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Roles</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                      <img
                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.display_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {user.roles.includes('admin') && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        Admin
                      </span>
                    )}
                    {user.roles.includes('creator') && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        Creator
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.is_verified ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRole(user.id, 'admin', user.roles.includes('admin'))}
                      className={`p-2 rounded-lg ${
                        user.roles.includes('admin')
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title="Toggle Admin"
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleRole(user.id, 'creator', user.roles.includes('creator'))}
                      className={`p-2 rounded-lg ${
                        user.roles.includes('creator')
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title="Toggle Creator"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleVerification(user.id, user.is_verified)}
                      className={`p-2 rounded-lg ${
                        user.is_verified
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title="Toggle Verification"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}