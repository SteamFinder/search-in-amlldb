import React from 'react';

const TTMLtool = () => {
  const iframeStyle = {
    width: '100%',
    height: '70vh',
    border: 'none', // Remove iframe border
  };

  return (
    <div>
      <iframe
        title="TTML-Tool"
        src="https://steve-xmh.github.io/amll-ttml-tool/"
        style={iframeStyle}
      />
    </div>
  );
};

export default TTMLtool;