import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useUserManagement from '../../../hooks/useUserManagement';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import { FaUser, FaEnvelope, FaUserShield, FaUserCog } from 'react-icons/fa';
import AdvancedPagination from '../../common/AdvancedPagination';

const UserManagementPage = () => {
  const { users, loading, error, fetchUsers, deleteUser } = useUserManagement();
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    document.getElementById('delete_user_modal').showModal();
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete._id);
      setUserToDelete(null);
      document.getElementById('delete_user_modal').close();
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredUsers?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentUsers = filteredUsers?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-20">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-sm text-base-content/60">
            Manage and monitor user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full md:w-64 pl-10 focus:border-none focus:ring-0 focus:outline-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
          </div>
          {/* <Link
            to="/users/new"
            className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Link> */}
        </div>
      </div>

      {loading && (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg border border-primary/20">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th className="p-4 font-semibold text-left">Name</th>
                <th className="p-4 font-semibold text-left">Email</th>
                <th className="p-4 font-semibold text-left">Role</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-primary/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full"></div>
                      <div className="h-4 bg-primary/10 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-primary/10 rounded w-48"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-6 w-20 bg-primary/10 rounded-full"></div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <div className="h-8 w-8 bg-primary/10 rounded-full"></div>
                      <div className="h-8 w-8 bg-primary/10 rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="alert alert-error shadow-lg">
          <div className="flex items-center gap-2">
            <FaUserShield className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg border border-base-300">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="p-4 font-semibold text-left">Name</th>
                  <th className="p-4 font-semibold text-left">Email</th>
                  <th className="p-4 font-semibold text-left">Role</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers?.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200/30 border-b border-base-300 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.profilePic ? (
                            <img 
                              src={user.profilePic} 
                              alt={user.name} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <FaUser className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-base-content/70">
                        <FaEnvelope className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                          user.type === 'admin'
                            ? 'bg-error/10 text-error'
                            : 'bg-primary/10 text-primary'
                        }`}>
                        {user.type === 'admin' ? (
                          <FaUserShield className="w-3 h-3" />
                        ) : (
                          <FaUserCog className="w-3 h-3" />
                        )}
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/users/${user._id}/edit`}
                          className="btn btn-ghost btn-sm text-primary hover:bg-primary/10 transition-colors duration-200"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="btn btn-ghost btn-sm text-error hover:bg-error/10 transition-colors duration-200"
                          disabled={user.type === 'admin'}
                          title={user.type === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalItems > 0 && (
            <AdvancedPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <dialog id="delete_user_modal" className="modal">
        <div className="modal-box bg-base-100">
          <h3 className="font-bold text-lg bg-gradient-to-r from-error to-error/80 bg-clip-text text-transparent">
            Confirm Deletion
          </h3>
          <p className="py-4 text-base-content/80">
            Are you sure you want to delete the user{' '}
            <strong className="text-base-content">{userToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button
              onClick={confirmDelete}
              className="btn btn-error gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default UserManagementPage;
