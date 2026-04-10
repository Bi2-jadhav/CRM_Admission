import { useState } from "react";
import { useData } from "../../Components/context/DataContext";
import { Plus, ChevronDown } from "lucide-react";

function ManageUsers() {
  const { users = [], addUser, updateUser, deleteUser } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    role: "counselor",
    status: "active",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateUser(editingId, formData);
      setEditingId(null);
    } else {
      addUser(formData);
    }

    resetForm();
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      deleteUser(id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "counselor",
      status: "active",
    });
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Users</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow hover:scale-105 transition"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form className="bg-white p-6 rounded-xl shadow mb-6">

          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit User" : "Add New User"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">

            <input name="name" placeholder="Name"
              value={formData.name} onChange={handleInputChange}
              className="border p-2 rounded" required />

            <input name="email" placeholder="Email"
              value={formData.email} onChange={handleInputChange}
              className="border p-2 rounded" required />

            <input name="phone" placeholder="Phone"
              value={formData.phone} onChange={handleInputChange}
              className="border p-2 rounded" />

            <input name="username" placeholder="Username"
              value={formData.username} onChange={handleInputChange}
              className="border p-2 rounded" required />

            <input name="password" placeholder="Password"
              value={formData.password} onChange={handleInputChange}
              className="border p-2 rounded" required />

            <select name="role" value={formData.role}
              onChange={handleInputChange}
              className="border p-2 rounded">
              <option value="counselor">Counselor</option>
              <option value="admin">Admin</option>
            </select>

            <select name="status" value={formData.status}
              onChange={handleInputChange}
              className="border p-2 rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {editingId ? "Update" : "Add"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* USERS LIST */}
      <div className="space-y-4">

        {users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >

              {/* HEADER */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpandedId(
                    expandedId === user.id ? null : user.id
                  )
                }
              >
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <ChevronDown
                  className={`transition ${
                    expandedId === user.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* DETAILS */}
              {expandedId === user.id && (
                <div className="mt-4 border-t pt-3 text-sm text-gray-600 space-y-1">

                  <p><b>Phone:</b> {user.phone || "N/A"}</p>
                  <p><b>Username:</b> {user.username}</p>
                  <p><b>Role:</b> {user.role}</p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-2">

                    <button
                      onClick={() => handleEdit(user)}
                      className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
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

export default ManageUsers;