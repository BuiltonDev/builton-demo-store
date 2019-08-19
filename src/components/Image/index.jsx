import React, { useRef } from 'react';

const Image = ({
  src,
  onLoad,
  onError,
  alt,
               }) => {
  const imgRef = useRef(null);

  const checkIfImgCached = () => {
    return imgRef.current.complete;
  };

  return (
    <img
      ref={imgRef}
      src={src}
      onLoad={() => {
        const isCached = checkIfImgCached();
        onLoad(isCached)
      }}
      onError={onError}
      alt={alt}
    />
  )
};

export default Image;
