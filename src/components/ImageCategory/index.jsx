import React, { useRef } from "react";
import ReactCursorPosition from "react-cursor-position";
import PropTypes from "prop-types";
import "./index.scss";

const ImageCategory = ({
  imageSrc,
  category,
  onLoad,
  style,
  onClick,
  pageLoaded
}) => {
  let positionX = 0;
  let positionY = 0;

  const imageRef = useRef(null);

  const handleImagePosition = el => {
    if (el.elementDimensions) {
      const midWidth = el.elementDimensions.width / 2;
      const midHeight = el.elementDimensions.height / 2;
      positionX = ((midWidth - el.position.x) * -1) / 60;
      positionY = ((midHeight - el.position.y) * -1) / 60;
      imageRef.current.style.transform = `translate(${positionX}px, ${positionY}px) scale(1.02)`;
    } else {
      imageRef.current.style.transform = `translate(0px, 0px) scale(1)`;
    }
  };

  return (
    <ReactCursorPosition
      className={`${pageLoaded ? "show-category" : "hide-category"}`}
      onPositionChanged={elementDimension =>
        handleImagePosition(elementDimension)
      }
    >
      <div
        onClick={onClick}
        className={`category-container ${category}-container`}
      >
        <div className={`category-title ${category}-title`}>
          {category.toUpperCase()}
        </div>
        <img
          onLoad={onLoad}
          ref={imageRef}
          className="category-image"
          src={imageSrc}
          alt={`${category}-illustration`}
        />
      </div>
    </ReactCursorPosition>
  );
};

ImageCategory.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
  pageLoaded: PropTypes.bool,
  onClick: PropTypes.func
};

export default ImageCategory;
