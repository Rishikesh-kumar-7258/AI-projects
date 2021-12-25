import React, { useState, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import {OpenCvProvider, useOpenCv} from "opencv-react";

function App() {
  const { loaded, cv } = useOpenCv();

  const showVideo = () => {
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(stream => {
      const video = document.getElementById('video');
      video.height = 350;
      video.width = 500;
      video.srcObject = stream;
      video.play();
    })
  }

  useEffect(() => {
    if (loaded) {
      showVideo();
    }
  }, [loaded])

  return (
    <div className="container-fluid">
        This is not working
      <OpenCvProvider>
        <canvas id='video' width={500} height={350}></canvas>
      </OpenCvProvider>
    </div>
  );
}

export default App;
