import { useEffect, useState } from "react";

export default function Task1() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "https://task-manager-r1b1.onrender.com";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/tasks")
      .then(res => res.json())
      .then(res => setTasks(res));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    setError("");
    fetch(apiUrl + "/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setTasks([...tasks, data]);
        setTitle("");
        setDescription("");
        setMessage("✅ Task added successfully");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setError("❌ Unable to create task"));
  };

  const handleEdit = task => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdate = () => {
    if (!editTitle.trim() || !editDescription.trim()) return;

    fetch(apiUrl + "/tasks/" + editId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription
      })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setTasks(tasks.map(t =>
          t._id === editId
            ? { ...t, title: editTitle, description: editDescription }
            : t
        ));
        setEditId(null);
        setMessage("✏️ Task updated successfully");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setError("❌ Unable to update task"));
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this task?")) return;

    fetch(apiUrl + "/tasks/" + id, { method: "DELETE" })
      .then(() => setTasks(tasks.filter(t => t._id !== id)));
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="fw-bold text-success">Task Manager</h1>
        <p className="text-muted">Organize your work efficiently</p>
      </div>

      {/* Alerts */}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Task */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Add New Task</h4>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button
                className="btn btn-success"
                disabled={!title || !description}
                onClick={handleSubmit}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="row">
        {tasks.length === 0 && (
          <p className="text-center text-muted">No tasks yet</p>
        )}

        {tasks.map(task => (
          <div className="col-md-6 mb-3" key={task._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                {editId === task._id ? (
                  <>
                    <input
                      className="form-control mb-2"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                    <input
                      className="form-control mb-3"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                    />
                    <div className="d-flex gap-2">
                      <button className="btn btn-warning" onClick={handleUpdate}>
                        Update
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{task.title}</h5>
                    <p className="card-text text-muted">
                      {task.description}
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
