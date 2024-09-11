import React, { useState } from 'react';
import 'components/styles/imageZoom.css';
const ImageZoom = ({ src, alt }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div className="image-container">
            <img
                src={src}
                alt={alt}
                className={`image ${isZoomed ? 'zoomed' : ''}`}
                onClick={handleClick}
            />
            {isZoomed && (
                <div className="overlay" onClick={handleClick}>
                    <img src={src} alt={alt} className="zoomed-image" />
                </div>
            )}
        </div>
    );
};

export default ImageZoom;
