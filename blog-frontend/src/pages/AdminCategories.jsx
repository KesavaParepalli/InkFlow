import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ROLE_ADMIN") {
      nav("/");
    }
  }, [user]);

  const load = async () => {
    const r = await api.get("/api/categories");
    setCats(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!name.trim()) return;
    if (editId) {
      await api.put(`/api/categories/${editId}`, { name });
    } else {
      await api.post("/api/categories", { name });
    }
    setName("");
    setEditId(null);
    load();
  };

  const del = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/api/categories/${id}`);
    load();
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-800">Category Management</h1>
            <p className="text-surface-500">Add, edit, or remove blog categories.</p>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="ink-card p-5 mb-8 hover:translate-y-0">
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="Enter category name..."
            className="ink-input flex-1"
          />
          <button onClick={save} className="ink-btn-primary !px-5">
            {editId ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Update
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add
              </>
            )}
          </button>
          {editId && (
            <button
              onClick={() => { setEditId(null); setName(""); }}
              className="ink-btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Categories Table */}
      <div className="ink-card overflow-hidden hover:translate-y-0">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">ID</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {cats.map((c) => (
              <tr key={c.id} className="hover:bg-primary-50/30 transition-colors">
                <td className="px-5 py-4 text-sm text-surface-400 font-mono">#{c.id}</td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-surface-800">{c.name}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => startEdit(c)}
                      className="ink-btn-secondary !py-1.5 !px-3 text-xs"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => del(c.id)}
                      className="ink-btn-danger !py-1.5 !px-3 text-xs"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cats.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-10 text-surface-400">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No categories found. Add one above!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
