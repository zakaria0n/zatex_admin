import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login, logout, userProfile, session } = useAuth();
    const navigate = useNavigate();

    // If already logged in but not admin, we should warn them or log them out automatically
    React.useEffect(() => {
        if (session && userProfile && userProfile.role !== 'admin') {
            setError("Ce compte n'a pas les droits d'administrateur.");
            logout();
        } else if (session && userProfile?.role === 'admin') {
            navigate('/');
        }
    }, [session, userProfile, navigate, logout]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await login(email, password);

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
        }
        // Si la connexion réussit, le useEffect plus haut ou le router prendra le relais
        // après que AuthContext ait mis à jour la session et userProfile.
    };

    return (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-dark)' }}>
            <div className="glass-panel auth-panel animate-fade-in" style={{ borderTop: '4px solid var(--text-secondary)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.png" alt="ZKR Logo" style={{ height: '48px', marginBottom: '1rem', filter: 'brightness(100) grayscale(100%)' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Access</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Connexion au panneau de gestion</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px', marginBottom: '1rem', border: '1px solid var(--danger)', borderRadius: '4px', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="admin@zkr.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
                        {loading ? <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px', borderColor: 'var(--bg-dark)', borderTopColor: 'transparent' }}></div> : 'Connexion'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
