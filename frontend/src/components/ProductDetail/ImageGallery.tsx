import React from 'react';
import {
  ImageSection,
  MobileProductTitle,
  ImageGallery as ImageGalleryWrapper,
  ThumbnailList,
  Thumbnail,
  MainImageContainer,
  MainImage,
  ImageLoadingSpinner,
  ImageErrorMessage,
} from './ProductDetail.styles';

interface ImageGalleryProps {
  title: string;
  images: string[];
  selectedImageIndex: number;
  imageLoading: boolean;
  imageError: boolean;
  onImageChange: (index: number) => void;
  onImageLoad: () => void;
  onImageError: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  title,
  images,
  selectedImageIndex,
  imageLoading,
  imageError,
  onImageChange,
  onImageLoad,
  onImageError,
}) => {
  return (
    <ImageSection>
      <MobileProductTitle>{title}</MobileProductTitle>
      <ImageGalleryWrapper>
        {images.length > 1 && (
          <ThumbnailList>
            {images.map((image, index) => (
              <Thumbnail
                key={index}
                src={image}
                alt={`${title} - ${index + 1}`}
                isActive={index === selectedImageIndex}
                onClick={() => onImageChange(index)}
              />
            ))}
          </ThumbnailList>
        )}
        
        <MainImageContainer>
          {imageLoading && !imageError && (
            <ImageLoadingSpinner />
          )}
          {imageError ? (
            <ImageErrorMessage>
              <div>📷</div>
              <div>Error al cargar la imagen</div>
            </ImageErrorMessage>
          ) : (
            <MainImage
              src={images[selectedImageIndex]}
              alt={title}
              onLoad={onImageLoad}
              onError={onImageError}
              style={{ opacity: imageLoading ? 0.3 : 1 }}
            />
          )}
        </MainImageContainer>
      </ImageGalleryWrapper>
    </ImageSection>
  );
}; 