// File: frontend/src/components/admin/presse/Presse.jsx

import React, { useState, useEffect } from 'react';
import FormArticle from './FormArticle';
import FormArticlePhoto from './FormArticlePhoto';
import FormArticleVideo from './FormArticleVideo';
import FormArticleThumbnailVideo from './FormArticleThumbnailVideo';
import { setResetFormat } from '../../../utils/formatController';
import './Presse.scss';

const formatDescriptions = {
    'article': '📝 Article texte sans média',
    'article-photo': '🖼️ Article avec image obligatoire',
    'article-video': '🎥 Article avec vidéo obligatoire',
    'article-thumbnail-video': '🖼️📹 Article avec miniature + vidéo',
};


const Presse = () => {
    const [selectedFormat, setSelectedFormat] = useState('');

    const handleReset = () => {
        setSelectedFormat('');
    };
    useEffect(() => {
        setResetFormat(() => setSelectedFormat(''));
    }, []);

    return (
        <div className="presse-wrapper">
            <h2 className="presse-title">📰 Publication Presse</h2>

            {!selectedFormat && (
                <>
                    <label htmlFor="format" className="presse-label">Choisir un format :</label>
                    <select
                        id="format"
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        required
                        className="presse-select"
                    >
                        <option value="">-- Sélectionner --</option>
                        <option value="article">📝 Article</option>
                        <option value="article-photo">🖼️ Article + Photo</option>
                        <option value="article-video">🎥 Article + Vidéo</option>
                        <option value="article-thumbnail-video">🖼️📹 Article + Miniature + Vidéo</option>
                    </select>
                </>
            )}

            {selectedFormat && (
                <>
                    <p className="presse-description">
                        {formatDescriptions[selectedFormat]}
                    </p>

                    <div className="presse-form-container">
                        {selectedFormat === 'article' && <FormArticle onReset={handleReset} />}
                        {selectedFormat === 'article-photo' && <FormArticlePhoto onReset={handleReset} />}
                        {selectedFormat === 'article-video' && <FormArticleVideo onReset={handleReset} />}
                        {selectedFormat === 'article-thumbnail-video' && <FormArticleThumbnailVideo onReset={handleReset} />}
                    </div>

                    <button onClick={handleReset} className="presse-reset-button">
                        🔄 Changer de format
                    </button>
                </>
            )}
        </div>
    );
};

export default Presse;
