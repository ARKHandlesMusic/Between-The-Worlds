import React from 'react';

export type CameraProps = {
  scale?: number;
  x?: number;
  y?: number;
  originX?: number | string;
  originY?: number | string;
  children: React.ReactNode;
};

export const Camera: React.FC<CameraProps> = ({
  scale = 1,
  x = 0,
  y = 0,
  originX = '50%',
  originY = '50%',
  children,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: `${typeof originX === 'number' ? `${originX}px` : originX} ${
          typeof originY === 'number' ? `${originY}px` : originY
        }`,
      }}
    >
      {children}
    </div>
  );
};
