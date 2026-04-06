import { useState } from 'react'
import { useData } from '../../Components/context/DataContext'   // ✅ FIXED
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react'
import './ManageUsers.css'

function ManageUsers() {

  // ✅ SAFE DESTRUCTURING
  const { users = [], addUser, updateUser, deleteUser } = useData()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    role: 'counselor',
    status: 'active'
  })

  const [expandedId, setExpandedId] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      updateUser(editingId, formData)
      setEditingId(null)
    } else {
      addUser(formData)
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      role: 'counselor',
      status: 'active'
    })

    setShowForm(false)
  }

  const handleEdit = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      username: user.username || '',
      password: user.password || '',
      role: user.role || 'counselor',
      status: user.status || 'active'
    })

    setEditingId(user.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)

    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      role: 'counselor',
      status: 'active'
    })
  }

  return (
    <div className="manage-users">

      <div className="page-header">
        <h2>Manage Users</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>

          <div className="form-grid">

            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
            <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" />
            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" required />
            <input name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required />

            <select name="role" value={formData.role} onChange={handleInputChange}>
              <option value="counselor">Counselor</option>
              <option value="admin">Admin</option>
            </select>

            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Add'}
            </button>

            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* USERS LIST */}
      <div className="users-list">

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="user-card">

              <div
                className="user-header"
                onClick={() =>
                  setExpandedId(expandedId === user.id ? null : user.id)
                }
              >
                <div>
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>

                <ChevronDown />
              </div>

              {expandedId === user.id && (
                <div className="user-details">

                  <p><b>Phone:</b> {user.phone || 'N/A'}</p>
                  <p><b>Username:</b> {user.username}</p>
                  <p><b>Role:</b> {user.role}</p>

                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>

                </div>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default ManageUsers