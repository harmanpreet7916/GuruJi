"use client"
import { useState } from 'react';

export default function Homes() {
  const [poseName, setPoseName] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchImage = async () => {
    try {
      const res = await fetch(`/api/s3?poseName=${poseName}`);
      const data = await res.json();
      
      if (res.status === 200) {
        setImageUrl(data.imageUrl);
        setError(null);
      } else {
        setError(data.message);
        setImageUrl(null);
      }
    } catch (err) {
    //   setError('Failed to fetch image');
    console.error(err);
      setImageUrl(null);
    }
  };

  return (
    <div>
      <h1>Yoga Pose Image Finder</h1>
      <input
        type="text"
        value={poseName}
        onChange={(e) => setPoseName(e.target.value)}
        placeholder="Enter yoga pose name"
      />
      <button onClick={handleFetchImage}>Get Image</button>

      {imageUrl && (
        <div>
          <h2>Image for {poseName}</h2>
          <img src={imageUrl} alt={poseName} width="300" />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
