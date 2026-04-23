import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  User as UserIcon,
  Mail,
  Building,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AvatarPlaceholder } from '@/components/ui/GenericPlaceholder';
import { StatusBadge } from '@/dashboard/components/StatusBadge';
import { toast } from 'sonner';

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: string }) => 
      userService.updateUser(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated successfully');
      setSelectedUser(null);
    },
    onError: (err: any) => {
      toast.error('Failed to update user role');
      console.error(err);
    }
  });

  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch = 
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-stone-300 animate-spin" />
        <p className="text-stone-500 font-serif italic">Loading directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium">Failed to load users. Please check your permissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold italic tracking-tight text-stone-900">User Management</h1>
          <p className="text-stone-500">Manage platform access, roles, and employee profiles.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all w-64 shadow-sm"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="ceo">CEO</option>
            <option value="user">Employee</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">User</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Department</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Joined</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredUsers?.map((user: any) => (
                <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <AvatarPlaceholder name={user.displayName} size="md" />
                      <div>
                        <p className="font-bold text-stone-900">{user.displayName || 'No Name'}</p>
                        <p className="text-xs text-stone-400 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center space-x-1",
                      user.role === 'admin' ? "bg-purple-100 text-purple-700" :
                      user.role === 'ceo' ? "bg-amber-100 text-amber-700" :
                      "bg-stone-100 text-stone-600"
                    )}>
                      <Shield className="w-3 h-3" />
                      <span>{user.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-stone-500">
                      <Building className="w-4 h-4 mr-2 text-stone-300" />
                      {user.department || 'Not Set'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-stone-300" />
                      {user.createdAt ? (
                        user.createdAt.seconds 
                          ? format(new Date(user.createdAt.seconds * 1000), 'MMM d, yyyy')
                          : format(new Date(user.createdAt), 'MMM d, yyyy')
                      ) : 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-stone-400 hover:text-stone-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-stone-200 shadow-sm hover:shadow-md"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                        title="Deactivate User"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers?.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-stone-200" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 italic">No users found</h3>
              <p className="text-stone-400 text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 overflow-hidden">
            <div className="flex items-center space-x-4 mb-8">
              <AvatarPlaceholder name={selectedUser.displayName} size="lg" />
              <div>
                <h3 className="text-2xl font-serif font-bold italic text-stone-900">Manage User</h3>
                <p className="text-sm text-stone-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">System Role</label>
                <div className="grid grid-cols-1 gap-2">
                  {['user', 'admin', 'ceo'].map((role) => (
                    <button
                      key={role}
                      onClick={() => updateRoleMutation.mutate({ userId: selectedUser.id, role })}
                      disabled={updateRoleMutation.isPending}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all",
                        selectedUser.role === role 
                          ? "bg-stone-900 border-stone-900 text-white shadow-lg" 
                          : "bg-white border-stone-100 text-stone-600 hover:border-stone-200"
                      )}
                    >
                      <span className="font-bold uppercase tracking-widest text-[10px]">{role}</span>
                      {selectedUser.role === role && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  <strong>Note:</strong> Manual role overrides via this panel may be overwritten by the system's email-based RBAC config unless the user is removed from code-defined allowlists.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-6 py-3 bg-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-200 transition-all uppercase tracking-widest text-[10px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
