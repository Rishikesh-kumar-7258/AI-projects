import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useOpenCv } from 'opencv-react';

export const Detector = () => {
    const { loaded, cv } = useOpenCv()
    const [cameras, setCameras] = useState([]);

    const handleClick = () => {
        // Getting the video element
        let video = document.getElementById('video');
        video.width = 480;
        video.height = 400;

        // Starting the camera
        navigator.mediaDevices.getUserMedia({ video: { deviceId: cameras[cameras.length - 1].deviceId }, audio: false })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            })

        // Using opencv
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst = new cv.Mat();

        let cap = new cv.VideoCapture(video);

        // processing video
        const FPS = 30;
        function processVideo() {
            let begin = Date.now();

            cap.read(src);
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

            cv.imshow("canvasOutput", dst);
            cv.imshow("canvasOutput2", src);

            // schedule next one.
            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }
        // schedule first one.
        setTimeout(processVideo, 0);
    }


    useEffect(() => {
        if (cv) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    setCameras(devices);
                })

        }
    }, [cv])

    // return components are here
    return (
        <Container className='mt-5'>
            <Row>
                <Col md={12}><Button variant="primary" onClick={handleClick} className='fixed-top'>Start Video</Button></Col>
                <Col md={12} className='text-center'>
                    <h1>Video Input</h1>
                    <video id="video" width={480} height={400} style={{ background: "black" }}></video>
                </Col>
                <Col  md={12} className='text-center'>
                    <h1>Video Output</h1>
                    <canvas id="canvasOutput" className='bg-danger' width={480} height={400} ></canvas>
                    <canvas id="canvasOutput2" className='bg-danger' width={480} height={400} ></canvas>
                </Col>
            </Row>
        </Container>

    )
}
