import { useState } from 'react'
import { useData } from '../../Components/context/DataContext'
import { Plus } from 'lucide-react'
import './ManageLists.css'

function ManageLists() {

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

  const sources = ['Meta', 'Website', 'Google', 'Instagram', 'Walkin', 'Inbound']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'count' ? parseInt(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      createdDate: new Date().toISOString().split('T')[0]
    }

    if (editingId) {
      updateList(editingId, payload)
      setEditingId(null)
    } else {
      addList(payload)
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
    if (window.confirm('Delete this list?')) {
      deleteList(id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', source: 'Meta', count: 0, status: 'active' })
  }

  return (
    <div className="manage-lists">

      {/* HEADER */}
      <div className="page-header">
        <h2>Manage Lead Lists</h2>

        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Create List'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="list-form">

          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="List Name"
            required
          />

          <select name="source" value={formData.source} onChange={handleInputChange}>
            {sources.map(source => (
              <option key={source}>{source}</option>
            ))}
          </select>

          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleInputChange}
          />

          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit">
            {editingId ? 'Update List' : 'Create List'}
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>

        </form>
      )}

      {/* LIST GRID */}
      <div className="lists-container">
        <div className="lists-grid">

          {lists.length === 0 ? (
            <div className="empty-state">No lists found</div>
          ) : (
            lists.map(list => (

              <div
                key={list.id}
                className="list-card"
                onClick={() =>
                  setExpandedId(expandedId === list.id ? null : list.id)
                }
              >

                {/* HEADER */}
                <div className="list-header">

                  <div className="list-info">
                    <h4>{list.name}</h4>
                    <p className="list-source">{list.source}</p>
                  </div>

                  <div className="list-stats">
                    <div className="stat">
                      <span className="stat-value">{list.count}</span>
                      <span className="stat-label">Leads</span>
                    </div>
                  </div>

                </div>

                {/* EXPANDED DETAILS */}
                {expandedId === list.id && (
                  <div className="list-details">

                    <div className="detail-row">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">{list.status}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Created</span>
                      <span className="detail-value">{list.createdDate}</span>
                    </div>

                    <div className="detail-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(list)
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(list.id)
                        }}
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                )}

              </div>

            ))
          )}

        </div>
      </div>
    </div>
  )
}

export default ManageLists