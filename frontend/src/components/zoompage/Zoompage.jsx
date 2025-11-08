// File: frontend3/src/components/zoompage/Zoompage.jsx

import React, { useEffect, useState } from 'react';
import { ZoomMtg } from '@zoom/meetingsdk';
import './Zoompage.css'; // tu peux styliser le loader ici si besoin

const Zoompage = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ZoomMtg.preLoadWasm();
    
  }, []);

  const joinMeeting = async () => {
    const meetingNumber = process.env.REACT_APP_ZOOM_MEETING_ID;
    const password = process.env.REACT_APP_ZOOM_PASSWORD;
    const userName = "Participant";
    const sdkKey = process.env.REACT_APP_ZOOM_API_KEY;

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/zoom/signature?meetingNumber=${meetingNumber}&role=0`);
      const data = await res.json();
      const signature = data.signature;

      ZoomMtg.init({
        leaveUrl: "http://localhost:3000/#zoompage",
        success: () => {
          ZoomMtg.join({
            sdkKey,
            signature,
            meetingNumber,
            passWord: password,
            userName,
            success: () => {
              console.log("🎉 Réunion rejointe avec succès");
              setLoading(false);
            },
            error: (err) => {
              console.error("❌ Erreur join :", err);
              setLoading(false);
            }
          });
        },
        error: (err) => {
          console.error("❌ Erreur init :", err);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error("❌ Erreur de signature :", err);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Bienvenue sur la page Zoom ✨</h2>
      {!loading && <button onClick={joinMeeting}>Rejoindre la réunion</button>}
      {loading && <p>⏳ Connexion à la réunion Zoom en cours...</p>}
      <div id="zmmtg-root"></div>
    </div>
  );
};

export default Zoompage;
