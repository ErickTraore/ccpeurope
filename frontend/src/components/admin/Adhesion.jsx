// File: frontend/src/components/admin/Adhesion.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser, updateUser, createUser } from '../../actions/userActions';
import { jwtDecode } from 'jwt-decode';
import './Adhesion.scss';

const Adhesion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector(state => state.user);

  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [newUser, setNewUser] = useState({ email: '', password: '', isAdmin: false });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/auth');
      return;
    }

    const decoded = jwtDecode(token);
    if (!decoded.isAdmin) {
      navigate('/auth');
      return;
    }

    dispatch(getUsers());
  }, [dispatch, navigate]);

  const handleDelete = (id) => {
    console.log("🧾 ID reçu dans handleDelete :", id);
    console.log("📋 Liste des utilisateurs :", users);

    const userToDelete = users.find(u => u.id === id);
    console.log("🗑️ Utilisateur ciblé :", userToDelete);

    if (!userToDelete) {
      alert("Utilisateur introuvable.");
      return;
    }

    dispatch(deleteUser(id)).then(() => {
      dispatch(getUsers());
    });
  };



  const handleEditClick = (user) => {
    console.log('🛠️ Modifier cliqué pour:', user);
    setEditMode(user.id);
    setEditData(prev => ({
      ...prev,
      [user.id]: {
        email: user.email,
        password: '',
        isAdmin: Boolean(user.isAdmin)
      }
    }));
  };

  const handleChange = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleUpdate = (id) => {
    if (editData[id]) {
      dispatch(updateUser(id, editData[id])).then(() => {
        dispatch(getUsers()); // ← Rafraîchit après succès
        setEditMode(null);
      });
    }
  };

  const handleCreateChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateUser = () => {
    if (newUser.email && newUser.password) {
      console.log("📤 Envoi vers backend :", newUser);
      dispatch(createUser(newUser)).then(() => {
        dispatch(getUsers()).then(() => {
          setNewUser({ email: '', password: '', isAdmin: false });
          setCreationSuccess(true);
        });
      });
    }
  };


  return (
    <div className="adhesion-admin">
      <h1>Gestion des adhérents</h1>

      <div className="action-buttons">
        <button className="create-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          ➕ Créer un nouvel adhérent
        </button>
        <button className="edit-btn" onClick={() => setShowEditSection(!showEditSection)}>
          🛠️ Modifier/Supprimer un adhérent
        </button>
      </div>

      {showCreateForm && (
        <div className="new-user-form">
          <h2>Créer un nouvel utilisateur</h2>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => handleCreateChange('email', e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={(e) => handleCreateChange('password', e.target.value)}
          />
          <label className="admin-checkbox">
            <span>Admin</span>
            <input
              type="checkbox"
              checked={newUser.isAdmin === true}
              onChange={(e) => handleCreateChange('isAdmin', e.target.checked)}
            />
          </label>

          <button className="create-btn" onClick={handleCreateUser}>Créer</button>
        </div>
      )}

      {showEditSection && (
        <>
          {editMode !== null && editData[editMode] && (
            <div className="edit-user-form">
              <h2>Modifier l'utilisateur</h2>
              <input
                type="email"
                placeholder="Email"
                value={editData[editMode].email}
                onChange={(e) => handleChange(editMode, 'email', e.target.value)}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={editData[editMode].password}
                onChange={(e) => handleChange(editMode, 'password', e.target.value)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={editData[editMode].isAdmin === true}
                  onChange={(e) => handleChange(editMode, 'isAdmin', e.target.checked)}
                /> Admin
              </label>
              <button onClick={() => handleUpdate(editMode)}>✅ Enregistrer</button>
              <button onClick={() => setEditMode(null)}>❌ Annuler</button>
            </div>
          )}

          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p>Erreur: {error}</p>
          ) : (
            <table className="adhesion-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? '✅' : '❌'}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditClick(user)}>Modifier</button>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}>Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );

};

export default Adhesion;
