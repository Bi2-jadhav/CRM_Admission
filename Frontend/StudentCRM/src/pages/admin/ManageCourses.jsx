import { useState } from 'react'
import { useData } from '../../Components/context/DataContext'
import { Plus } from 'lucide-react'
import './ManageCourses.css'

function ManageCourses() {

  const {
    courses = [],
    addCourse,
    updateCourse,
    deleteCourse
  } = useData()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    duration: '',
    mode: 'Offline',
    status: 'Active'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      updateCourse(editingId, formData)
      setEditingId(null)
    } else {
      addCourse({
        ...formData,
        createdDate: new Date().toISOString().split('T')[0]
      })
    }

    resetForm()
  }

  const handleEdit = (course) => {
    setFormData({
      name: course.name || '',
      specialization: course.specialization || '',
      duration: course.duration || '',
      mode: course.mode || 'Offline',
      status: course.status || 'Active'
    })
    setEditingId(course.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      specialization: '',
      duration: '',
      mode: 'Offline',
      status: 'Active'
    })
  }

  return (
    <div className="manage-courses">

      {/* HEADER */}
      <div className="page-header">
        <h2>Manage Courses</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="course-form">

          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Course Name"
            required
          />

          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
          />

          <input
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Duration"
          />

          <select
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
          >
            <option>Offline</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button type="submit">
            {editingId ? 'Update Course' : 'Add Course'}
          </button>

          <button type="button" onClick={resetForm}>
            Cancel
          </button>

        </form>
      )}

      {/* LIST */}
      <div className="courses-list">

        {courses.length === 0 ? (
          <p>No courses added yet.</p>
        ) : (
          courses.map(course => (
            <div key={course.id} className="course-card">

              {/* HEADER */}
              <div
                className="course-header"
                onClick={() =>
                  setExpandedId(
                    expandedId === course.id ? null : course.id
                  )
                }
              >
                <h4>{course.name}</h4>
              </div>

              {/* DETAILS */}
              {expandedId === course.id && (
                <div className="course-details">

                  <p><b>Specialization:</b> {course.specialization}</p>
                  <p><b>Duration:</b> {course.duration}</p>
                  <p><b>Mode:</b> {course.mode}</p>
                  <p><b>Status:</b> {course.status}</p>

                  <div className="actions">
                    <button onClick={() => handleEdit(course)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(course.id)}>
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
  )
}

export default ManageCourses