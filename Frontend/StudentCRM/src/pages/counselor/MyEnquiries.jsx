import { useState, useEffect } from "react";
import { useData } from "../../Components/context/DataContext";
import { useAuth } from "../../Components/context/AuthContext";
import { Plus, Upload } from "lucide-react";

function MyEnquiries() {
  const {
    enquiries = [],
    users = [],
    courses = [],
    lists = [],
    addEnquiry,
    updateEnquiry,
    getAllEnquiries,
    getAllLists,
    addAdmission,
    error,
  } = useData();

  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    courseInterested: "MBA",
    source: "",
    stage: "New",
    counselorId: "",
  });

  const counselors = users.filter((u) => u.role === "COUNSELOR");

  useEffect(() => {
    if (user?.id) {
      getAllEnquiries();
      getAllLists();
    }
  }, [user?.id]);

  const myEnquiries = enquiries.filter(
    (e) => String(e.assignedCounselorId) === String(user?.id)
  );

  const statuses = ["New", "Called", "Follow-up", "Closed", "Converted"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConvert = async (enquiry) => {
    const payload = {
      enquiryId: enquiry.id,
      studentName: enquiry.studentName,
      courseSelected: enquiry.courseInterested,
      fees: 0,
      feesPaid: 0,
      paymentStatus: "Pending",
      admissionDate: new Date().toISOString().split("T")[0],
    };

    const success = await addAdmission(payload);

    if (success) {
      alert("✅ Converted to Admission");
      await getAllEnquiries();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      assignedCounselorId: parseInt(formData.counselorId),
      createdDate: new Date().toISOString().split("T")[0],
    };

    if (editingId) {
      await updateEnquiry(editingId, payload);
      setEditingId(null);
    } else {
      await addEnquiry(payload);
    }

    await getAllEnquiries();

    setFormData({
      studentName: "",
      phone: "",
      email: "",
      courseInterested: "MBA",
      source: "",
      stage: "New",
      counselorId: "",
    });

    setShowForm(false);
  };

  const handleEdit = (enquiry) => {
    setFormData({
      ...enquiry,
      counselorId: enquiry.assignedCounselorId,
    });
    setEditingId(enquiry.id);
    setShowForm(true);
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Leads</h2>

        <div className="flex gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white cursor-pointer hover:scale-105 transition">
            <Upload size={16} />
            Import
            <input type="file" hidden />
          </label>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Plus size={16} />
            {showForm ? "Cancel" : "Add Lead"}
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-xl shadow mb-6"
        >
          <input
            name="studentName"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />

          <select
            name="courseInterested"
            value={formData.courseInterested}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            {courses.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">Lead Source</option>
            {lists.map((l) => (
              <option key={l.id}>{l.name}</option>
            ))}
          </select>

          <select
            name="stage"
            value={formData.stage}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            name="counselorId"
            value={formData.counselorId}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Assign Counselor</option>
            {counselors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.email}
              </option>
            ))}
          </select>

          <button className="bg-indigo-600 text-white rounded p-2 col-span-full">
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {/* TABLE (LIKE COMPANY DASHBOARD) */}
<div className="bg-white rounded-xl shadow overflow-hidden">

  {/* HEADER */}
  <div className="grid grid-cols-5 px-6 py-3 text-sm font-semibold text-gray-500 border-b bg-gray-50">
    <div>Candidate</div>
    <div>Phone</div>
    <div>Course</div>
    <div>Status</div>
    <div className="text-right">Actions</div>
  </div>

  {/* ROWS */}
  {myEnquiries.length === 0 ? (
    <div className="p-6 text-center text-gray-500">No leads found</div>
  ) : (
    myEnquiries.map((enquiry) => (
      <div
        key={enquiry.id}
        className="grid grid-cols-5 items-center px-6 py-4 border-b hover:bg-gray-50 transition"
      >
        {/* NAME */}
        <div className="font-medium">{enquiry.studentName}</div>

        {/* PHONE */}
        <div className="text-sm text-gray-600">{enquiry.phone}</div>

        {/* COURSE */}
        <div className="text-sm">{enquiry.courseInterested}</div>

        {/* STATUS */}
        <div>
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
            {enquiry.stage}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          {/* EDIT BUTTON (COLORED ✅) */}
          <button
            onClick={() => handleEdit(enquiry)}
            className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Edit
          </button>

          {/* CONVERT BUTTON */}
          {enquiry.stage !== "Converted" && (
            <button
              onClick={() => handleConvert(enquiry)}
              className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Convert
            </button>
          )}
        </div>
      </div>
    ))
  )}
</div>

      {myEnquiries.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No leads found
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default MyEnquiries;