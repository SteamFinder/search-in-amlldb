import React from 'react';

const TTMLtool = () => {
  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none', // Remove iframe border
  };

  return (
      <iframe
        title="TTML-Tool"
        src="https://steve-xmh.github.io/amll-ttml-tool/"
        style={iframeStyle}
      />
  );
};

export default TTMLtool;