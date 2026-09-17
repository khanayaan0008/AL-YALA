import React, { useState, useEffect } from 'react';

export default function AdminControl() {
  // Default Sample Data (agar storage khali ho)
  const initialUsers = [
    { id: 'USR-101', name: 'Abdul Mannam', email: 'abdul@example.com', orders: 4, spent: 145000, status: 'Active' },
    { id: 'USR-102', name: 'Rohit Deshmukh', email: 'rohit.d@example.com', orders: 1, spent: 34000, status: 'Active' },
    { id: 'USR-103', name: 'Vikram Rajput', email: 'vikram.spam@test.com', orders: 0, spent: 0, status: 'Suspended' },
    { id: 'USR-104', name: 'Ananya Sharma', email: 'ananya@artlover.in', orders: 6, spent: 280000, status: 'Active' },
  ];

  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSpent, setNewSpent] = useState('');

  // 1. Page load hone par LocalStorage se users load karna
  useEffect(() => {
    const savedUsers = localStorage.getItem('alyala_registered_users');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        setUsers(initialUsers);
      }
    } else {
      setUsers(initialUsers);
      localStorage.setItem('alyala_registered_users', JSON.stringify(initialUsers));
    }
  }, []);

  // 2. Helper function jo state aur localStorage dono ko update karega
  const updateUsersList = (updatedList) => {
    setUsers(updatedList);
    localStorage.setItem('alyala_registered_users', JSON.stringify(updatedList));
  };

  // 3. Suspend / Reactivate toggle logic
  const toggleUserStatus = (id) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    });
    updateUsersList(updated);
  };

  // 4. Naya user add karne ka function
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newName.trim(),
      email: newEmail.trim(),
      orders: 1,
      spent: Number(newSpent) || 0,
      status: 'Active',
    };

    const updated = [newUser, ...users];
    updateUsersList(updated);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewSpent('');
    setShowAddModal(false);
  };

  // 5. Delete User Function
  const handleDeleteUser = (id) => {
    if (window.confirm('Kya aap sach me is user ko remove karna chahte hain?')) {
      const updated = users.filter((u) => u.id !== id);
      updateUsersList(updated);
    }
  };

  // Real-time calculated stats
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'Active').length;
  const suspendedUsersCount = users.filter((u) => u.status === 'Suspended').length;
  const totalRevenue = users.reduce((acc, curr) => acc + (Number(curr.spent) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Dynamic Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total Registered</p>
          <h3 className="text-3xl font-serif font-bold text-[#182119] mt-1">{totalUsersCount}</h3>
          <span className="text-[11px] text-stone-500 mt-1 block">Live client database</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Active Collectors</p>
          <h3 className="text-3xl font-serif font-bold text-emerald-700 mt-1">{activeUsersCount}</h3>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">● Verified Access</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Suspended Accounts</p>
          <h3 className="text-3xl font-serif font-bold text-rose-600 mt-1">{suspendedUsersCount}</h3>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 block">Restricted from ordering</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-3xl font-serif font-bold text-[#182119] mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </h3>
          <span className="text-[11px] text-stone-500 mt-1 block">Accumulated sales value</span>
        </div>

      </div>

      {/* User Management Table */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        
        {/* Table Header & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#182119]">Registered Collectors & Access Control</h2>
            <p className="text-xs text-stone-500">Live database with permanent local backup</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#182119] hover:bg-[#2A382C] text-amber-100 text-xs font-semibold px-4 py-2.5 rounded-2xl transition shadow flex items-center justify-center gap-2"
          >
            <span>+</span> Add New Client
          </button>
        </div>

        {/* Add User Modal Popup */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-base text-[#182119]">Register New User</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Sameer Sheikh"
                    required
                    className="w-full px-3 py-2 border rounded-xl border-stone-300 focus:outline-[#182119]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. sameer@example.com"
                    required
                    className="w-full px-3 py-2 border rounded-xl border-stone-300 focus:outline-[#182119]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Total Spent Amount (₹)</label>
                  <input
                    type="number"
                    value={newSpent}
                    onChange={(e) => setNewSpent(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-2 border rounded-xl border-stone-300 focus:outline-[#182119]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-500 font-semibold hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#182119] text-amber-50 px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#2A382C]"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3.5 px-4 font-mono text-stone-400 font-bold">{user.id}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">{user.name}</td>
                  <td className="py-3.5 px-4 text-stone-500 font-mono">{user.email}</td>
                  <td className="py-3.5 px-4 font-semibold">{user.orders} orders</td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">
                    ₹{Number(user.spent).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        user.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition shadow-sm ${
                        user.status === 'Active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-2.5 py-1.5 rounded-xl font-bold text-[11px] text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition"
                      title="Remove User"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}