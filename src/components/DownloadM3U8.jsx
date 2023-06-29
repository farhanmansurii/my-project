import React from 'react';

const DownloadM3U8Component = ({ m3u8Link, fileName = "Deafault" }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = m3u8Link;
    link.download = fileName;
    link.click();
  };

  return (
    <div>
      <button onClick={handleDownload}>Download M3U8 File</button>
    </div>
  );
};

export default DownloadM3U8Component;
