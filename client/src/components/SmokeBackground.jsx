import React from 'react';

const SmokeBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Top Left */}
      <div className="smoke-blob smoke-1 w-[500px] h-[500px] -top-20 -left-20"></div>
      
      {/* Blob 2 - Bottom Right */}
      <div className="smoke-blob smoke-2 w-[600px] h-[600px] -bottom-32 -right-32"></div>
      
      {/* Blob 3 - Center Moving */}
      <div className="smoke-blob smoke-3 w-[800px] h-[800px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
};

export default SmokeBackground;