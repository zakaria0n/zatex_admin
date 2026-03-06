import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, FileText, Activity, LogOut, Check, X, Trash2, Ban } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
    const { userProfile, session, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'documents'
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            if (activeTab === 'users') fetchUsers();
            if (activeTab === 'documents') fetchDocuments();
        }
    }, [activeTab, session]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/admin/documents`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            setDocuments(data);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId, newStatus) => {
        try {
            await axios.put(`${API_URL}/api/admin/users/${userId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${session.access_token}` } }
            );
            // Refresh list locally
            setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (error) {
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action est irréversible.")) return;

        try {
            await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            alert("Erreur lors de la suppression de l'utilisateur");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-wrapper animate-fade-in">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="logo-container" style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center' }}>
                    <img src="/src/assets/icon.png" alt="ZKR Logo" style={{ height: '36px', filter: 'brightness(100) grayscale(100%)' }} />
                </div>

                <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                        className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ justifyContent: 'flex-start', border: activeTab === 'users' ? 'none' : '1px solid transparent' }}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={18} /> Utilisateurs
                    </button>
                    <button
                        className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ justifyContent: 'flex-start', border: activeTab === 'documents' ? 'none' : '1px solid transparent' }}
                        onClick={() => setActiveTab('documents')}
                    >
                        <FileText size={18} /> Documents
                    </button>
                </nav>

                <div className="sidebar-footer" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div className="user-info" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {userProfile?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{userProfile?.full_name || 'Admin'}</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary" style={{ width: '100%', border: 'none' }} onClick={handleLogout}>
                        <LogOut size={16} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {activeTab === 'users' ? 'Gestion des Utilisateurs' : 'Documents Générés'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {activeTab === 'users' ? 'Approuvez ou rejetez les demandes de la file d\'attente.' : 'Consultez les documents générés sur la plateforme.'}
                        </p>
                    </div>
                </div>

                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <div className="loader"></div>
                        </div>
                    ) : activeTab === 'users' ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nom Complet</th>
                                        <th>Email</th>
                                        <th>Université</th>
                                        <th>Filière</th>
                                        <th>Date d'inscription</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td style={{ fontWeight: '500' }}>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.university}</td>
                                            <td>{user.field_of_study}</td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge badge-${user.status}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {user.status !== 'approved' && (
                                                        <button className="btn btn-success" style={{ padding: '0.25rem 0.5rem' }} title="Approuver (Whitelist)" onClick={() => updateUserStatus(user.id, 'approved')}>
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    {user.status !== 'rejected' && (
                                                        <button className="btn btn-warning" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'transparent', borderColor: 'var(--warning-bg)', color: 'var(--warning)' }} title="Rejeter / Révoquer" onClick={() => updateUserStatus(user.id, 'rejected')}>
                                                            <Ban size={16} />
                                                        </button>
                                                    )}
                                                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} title="Supprimer définitivement" onClick={() => deleteUser(user.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Aucun utilisateur trouvé.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Auteur</th>
                                        <th>Thème</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.id}>
                                            <td style={{ fontWeight: '500' }}>{doc.title}</td>
                                            <td>{doc.user?.full_name || doc.user?.email}</td>
                                            <td><span className="badge" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{doc.theme_used}</span></td>
                                            <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', textDecoration: 'none' }}>
                                                    Voir le PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    {documents.length === 0 && (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Aucun document généré pour l'instant.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
