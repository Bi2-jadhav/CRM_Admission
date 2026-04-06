import { useState } from 'react'
import { useData } from '../../Components/context/DataContext'
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react'
import './ManageLists.css'

function ManageLists() {

  // ✅ SAFE DESTRUCTURING (MOST IMPORTANT FIX)
  const {
    lists = [],
    addList,
    updateList,
    deleteList
  } = useData()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    source: 'Meta',
    count: 0,
    status: 'active'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'count' ? parseInt(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      updateList(editingId, {
        ...formData,
        createdDate: new Date().toISOString().split('T')[0]
      })
      setEditingId(null)
    } else {
      addList({
        ...formData,
        createdDate: new Date().toISOString().split('T')[0]
      })
    }

    setFormData({ name: '', source: 'Meta', count: 0, status: 'active' })
    setShowForm(false)
  }

  const handleEdit = (list) => {
    setFormData({
      name: list.name || '',
      source: list.source || 'Meta',
      count: list.count || 0,
      status: list.status || 'active'
    })
    setEditingId(list.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteList(id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', source: 'Meta', count: 0, status: 'active' })
  }

  const sources = ['Meta', 'Website', 'Google', 'Instagram', 'Walkin', 'Inbound']

  return (
    <div className="manage-lists">

      <div className="page-header">
        <h2>Manage Lead Lists</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Create List'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="list-form">
          <h3>{editingId ? 'Edit List' : 'Create New List'}</h3>

          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="List Name" />
          
          <select name="source" value={formData.source} onChange={handleInputChange}>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          <input type="number" name="count" value={formData.count} onChange={handleInputChange} />

          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}

      <div className="lists-container">

        {/* ✅ SAFE CHECK */}
        {lists.length === 0 ? (
          <p>No lists found</p>
        ) : (
          lists.map(list => (
            <div key={list.id}>
              <h4>{list.name}</h4>
              <p>{list.source}</p>

              <button onClick={() => handleEdit(list)}>Edit</button>
              <button onClick={() => handleDelete(list.id)}>Delete</button>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default ManageLists