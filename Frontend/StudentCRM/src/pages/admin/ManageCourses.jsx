import { useState } from "react";
import { useData } from "../../Components/context/DataContext";
import { Plus } from "lucide-react";

function ManageCourses() {
  const { courses = [], addCourse, updateCourse, deleteCourse } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    duration: "",
    mode: "Offline",
    status: "Active",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateCourse(editingId, formData);
      setEditingId(null);
    } else {
      addCourse({
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
      });
    }

    resetForm();
  };

  const handleEdit = (course) => {
    setFormData(course);
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this course?")) {
      deleteCourse(id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      specialization: "",
      duration: "",
      mode: "Offline",
      status: "Active",
    });
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Courses</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:scale-105 transition"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Course"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form className="grid md:grid-cols-3 gap-4 bg-white p-5 rounded-xl shadow mb-6">

          <input name="name" placeholder="Course Name"
            value={formData.name} onChange={handleInputChange}
            className="border p-2 rounded" required />

          <input name="specialization" placeholder="Specialization"
            value={formData.specialization} onChange={handleInputChange}
            className="border p-2 rounded" />

          <input name="duration" placeholder="Duration"
            value={formData.duration} onChange={handleInputChange}
            className="border p-2 rounded" />

          <select name="mode" value={formData.mode}
            onChange={handleInputChange}
            className="border p-2 rounded">
            <option>Offline</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>

          <select name="status" value={formData.status}
            onChange={handleInputChange}
            className="border p-2 rounded">
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            onClick={handleSubmit}
            className="col-span-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            {editingId ? "Update Course" : "Add Course"}
          </button>
        </form>
      )}

      {/* CARDS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {courses.length === 0 ? (
          <p className="text-gray-500">No courses added yet.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer"
            >

              {/* HEADER */}
              <div
                className="flex justify-between items-center"
                onClick={() =>
                  setExpandedId(
                    expandedId === course.id ? null : course.id
                  )
                }
              >
                <h3 className="font-semibold text-lg">{course.name}</h3>

                <span className={`text-xs px-2 py-1 rounded-full ${
                  course.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {course.status}
                </span>
              </div>

              {/* DETAILS */}
              {expandedId === course.id && (
                <div className="mt-4 space-y-2 text-sm text-gray-600 border-t pt-3">

                  <p><b>Specialization:</b> {course.specialization || "N/A"}</p>
                  <p><b>Duration:</b> {course.duration || "N/A"}</p>
                  <p><b>Mode:</b> {course.mode}</p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-2">

                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
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
  );
}

export default ManageCourses;