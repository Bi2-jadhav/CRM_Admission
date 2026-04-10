import { useState } from "react";
import { useData } from "../../Components/context/DataContext";
import { Plus } from "lucide-react";

function ManageLeads() {
  const {
    enquiries = [],
    addEnquiry,
    updateEnquiry,
    deleteEnquiry,
    users = [],
    courses = [],
    lists = [],
  } = useData();

  const counselors = users.filter(
    (u) => u.role?.toLowerCase() === "counselor"
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("All");

  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    courseInterested: "",
    source: "",
    stage: "New",
    assignedCounselorId: null,
    status: "New",
  });

  const stages = ["New", "Called", "Follow-up", "Closed"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "assignedCounselorId"
          ? value
            ? Number(value)
            : null
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateEnquiry(editingId, formData);
      setEditingId(null);
    } else {
      await addEnquiry({
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
      });
    }

    setFormData({
      studentName: "",
      phone: "",
      email: "",
      courseInterested: "",
      source: "",
      stage: "New",
      assignedCounselorId: null,
      status: "New",
    });

    setShowForm(false);
  };

  const handleEdit = (enquiry) => {
    setFormData(enquiry);
    setEditingId(enquiry.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this lead?")) {
      await deleteEnquiry(id);
    }
  };

  const filteredEnquiries = enquiries.filter(
    (e) =>
      (e.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        e.phone?.includes(search)) &&
      (filterStage === "All" || e.stage === filterStage)
  );

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Leads</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition shadow"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Lead"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          {stages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* FORM */}
      {showForm && (
        <form className="grid md:grid-cols-3 gap-4 bg-white p-5 rounded-xl shadow mb-6">
          <input name="studentName" placeholder="Name" value={formData.studentName} onChange={handleInputChange} className="border p-2 rounded" />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="border p-2 rounded" />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="border p-2 rounded" />

          <select name="courseInterested" value={formData.courseInterested} onChange={handleInputChange} className="border p-2 rounded">
            <option value="">Course</option>
            {courses.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>

          <select name="source" value={formData.source} onChange={handleInputChange} className="border p-2 rounded">
            <option value="">Source</option>
            {lists.map((l) => (
              <option key={l.id}>{l.name}</option>
            ))}
          </select>

          <select name="stage" value={formData.stage} onChange={handleInputChange} className="border p-2 rounded">
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select name="assignedCounselorId" value={formData.assignedCounselorId || ""} onChange={handleInputChange} className="border p-2 rounded">
            <option value="">Assign Counselor</option>
            {counselors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button onClick={handleSubmit} className="col-span-full bg-indigo-600 text-white p-2 rounded">
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-6 px-6 py-3 text-sm font-semibold text-gray-500 bg-gray-50 border-b">
          <div>Candidate</div>
          <div>Phone</div>
          <div>Course</div>
          <div>Status</div>
          <div>Counselor</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredEnquiries.map((e) => (
          <div key={e.id} className="grid grid-cols-6 items-center px-6 py-4 border-b hover:bg-gray-50">

            <div className="font-medium">{e.studentName}</div>
            <div className="text-sm text-gray-600">{e.phone}</div>
            <div>{e.courseInterested}</div>

            <div>
              <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
                {e.stage}
              </span>
            </div>

            {/* COUNSELOR SELECT */}
            <select
              value={e.assignedCounselorId || ""}
              onChange={async (ev) => {
                await updateEnquiry(e.id, {
                  ...e,
                  assignedCounselorId: ev.target.value
                    ? Number(ev.target.value)
                    : null,
                });
              }}
              className="border p-1 rounded"
            >
              <option value="">Unassigned</option>
              {counselors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">

              <button
                onClick={() => handleEdit(e)}
                className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(e.id)}
                className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredEnquiries.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No leads found
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageLeads;