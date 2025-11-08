// File: frontend/src/components/profilepage/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfileInfo,
  updateProfileInfo,
  fetchProfileMedia,
  updateProfileMedia
} from '../../actions/profileActions';

const MEDIA_API = process.env.REACT_APP_MEDIA_API;

const ProfilePage = () => {
  const dispatch = useDispatch();

  const profileInfo = useSelector((state) => state.profileInfo);
  const { loading, error, data } = profileInfo;

  const profileMedia = useSelector((state) => state.profileMedia);
  const { slots, loading: mediaLoading, error: mediaError } = profileMedia;

  const [activeTab, setActiveTab] = useState('infos');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone1: '',
    phone2: '',
    phone3: '',
    address: '',
  });

  const [uploading, setUploading] = useState({});
  const [mediaEdits, setMediaEdits] = useState({}); // { [id]: { url } }

  useEffect(() => {
    dispatch(fetchProfileInfo());
  }, [dispatch]);

  useEffect(() => {
    if (data?.id) {
      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone1: data.phone1 || '',
        phone2: data.phone2 || '',
        phone3: data.phone3 || '',
        address: data.address || '',
      });
      dispatch(fetchProfileMedia(data.id));
    }
  }, [data, dispatch]);

  // 🔁 Ajoute ce bloc AVANT tout return ou if
  useEffect(() => {
    const handleTokenUpdate = () => {
      console.log('🔄 Token mis à jour, rechargement du profil...');
      dispatch(fetchProfileInfo());
    };

    window.addEventListener('tokenUpdated', handleTokenUpdate);
    return () => window.removeEventListener('tokenUpdated', handleTokenUpdate);
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data?.id) {
      dispatch(updateProfileInfo(data.id, form));
    }
  };

  const handleFileUpload = async (mediaId, file) => {
    console.log('📤 Début du téléversement pour mediaId :', mediaId);

    if (!file) {
      console.log('❌ Aucun fichier sélectionné');
      return;
    }

    console.log('📁 Fichier sélectionné :', file.name);
    setUploading((prev) => ({ ...prev, [mediaId]: true }));

    const formData = new FormData();
    formData.append('image', file);
    console.log('📦 FormData préparé avec champ "image"');

    try {
      console.log('🚀 Envoi vers :', `${MEDIA_API}/api/uploadImageProfile`);
      const response = await fetch(`${MEDIA_API}/api/uploadImageProfile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      console.log('📨 Réponse reçue du backend');
      const result = await response.json();
      console.log('📄 Contenu JSON :', result);

      if (!response.ok || !result.filename) {
        console.error('❌ Échec upload — réponse invalide ou filename manquant');
        throw new Error('Échec upload');
      }

      const imageUrl = `/imagesprofile/${result.filename}`;
      // ✅ chemin relatif     
      console.log('✅ URL image construite :', imageUrl);
      console.log('📤 Envoi vers updateProfileMedia avec mediaId :', mediaId);
      await dispatch(updateProfileMedia(mediaId, { url: imageUrl }));
      await dispatch(fetchProfileMedia(data.id)); // ✅ recharge les slots après mise à jour

    } catch (err) {
      console.error(`❌ Erreur upload image pour media ${mediaId} :`, err.message);
    } finally {
      console.log('🔚 Fin du téléversement pour mediaId :', mediaId);
      setUploading((prev) => ({ ...prev, [mediaId]: false }));
    }

  };


  if (loading) return <div>Chargement du profil...</div>;
  if (error) return <div>Erreur : {error}</div>;
  const safeSlots = Array.isArray(slots) ? slots : [];



  return (
    <div>
      <h1>Profil de l'utilisateur</h1>

      {/* 🔹 Menu d’onglets */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('infos')}>Mes infos</button>
        <button onClick={() => setActiveTab('images')}>Mes images</button>
        <button onClick={() => setActiveTab('bio')}>Ma biographie</button>
      </div>

      {/* 🔹 Onglet "Mes infos" */}
      {activeTab === 'infos' && (
        <form onSubmit={handleSubmit}>
          <p><label>Nom : </label><input name="firstName" value={form.firstName} onChange={handleChange} /></p>
          <p><label>Prénom : </label><input name="lastName" value={form.lastName} onChange={handleChange} /></p>
          <p><label>Email : </label><input name="email" value={form.email} onChange={handleChange} /></p>
          <p><label>Téléphone 1 : </label><input name="phone1" value={form.phone1} onChange={handleChange} /></p>
          <p><label>Téléphone 2 : </label><input name="phone2" value={form.phone2} onChange={handleChange} /></p>
          <p><label>Téléphone 3 : </label><input name="phone3" value={form.phone3} onChange={handleChange} /></p>
          <p><label>Adresse : </label><textarea name="address" value={form.address} onChange={handleChange} /></p>
          <button type="submit">Enregistrer</button>
        </form>
      )}

      {/* 🔹 Onglet "Mes images" */}
      {activeTab === 'images' && (
        <div>
          {mediaLoading && <p>Chargement des images...</p>}
          {mediaError && <p>Erreur : {mediaError}</p>}
          {!mediaLoading && safeSlots.length === 0 && (
            Object.values(uploading).some(Boolean)
              ? <p>⏳ Téléversement en cours...</p>
              : <p>Aucune image disponible.</p>
          )}


          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {safeSlots.map((media) => (
              <div key={media.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                <img
                  src={
                    media.url
                      ? `${MEDIA_API}${media.url}`
                      : `${MEDIA_API}${media.path}`
                  }
                  alt="Image"
                  style={{ width: '150px', height: 'auto', borderRadius: '4px' }}
                />

                <div style={{ marginTop: '1rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(media.id, e.target.files[0])}
                    disabled={uploading[media.id]}
                  />
                  {uploading[media.id] && <p>⏳ Téléversement en cours...</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Onglet "Ma biographie" */}
      {activeTab === 'bio' && (
        <div>
          <p>📝 Biographie à intégrer ici</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
