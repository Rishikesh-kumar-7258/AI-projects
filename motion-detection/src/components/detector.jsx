import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useOpenCv } from 'opencv-react';

export const Detector = () => {
    const { loaded, cv } = useOpenCv()
    const [cameras, setCameras] = useState([]);

    const handleClick = () => {

        if (!loaded) return ;
        
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
        let fg_mask = new cv.Mat();
        let fgbg = new cv.BackgroundSubtractorMOG2(100, 50, true);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();

        let cap = new cv.VideoCapture(video);

        let once = true;

        // processing video
        const FPS = 30;
        function processVideo() {
            let begin = Date.now();

            cap.read(src);
            fgbg.apply(src, fg_mask);
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
            cv.threshold(fg_mask, fg_mask, 25, 255, cv.THRESH_BINARY);

            let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));

            cv.findContours(fg_mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            cv.drawContours(dst, contours, -1, color, 1, cv.LINE_8, hierarchy, 100);
            
            if (once)
            {
                for (let contour in contours)
                {
                    console.log(contour);
                }
                once = false;
            }

            cv.imshow("canvasOutput", dst);
            cv.imshow("canvasOutput2", fg_mask);

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
                <Col md={12}><Button variant="primary" onClick={handleClick} className='fixed-top m-3'>Start Video</Button></Col>
                <Col md={12} className='text-center mx-2'>
                    <h1>Video Input</h1>
                    <video id="video" width={480} height={400} style={{ background: "black" }}></video>
                </Col>
                <Col md={12} className='text-center mx-2'>
                    <h1>Video Output</h1>
                    <canvas id="canvasOutput" className='bg-danger' width={480} height={400} ></canvas>
                    <canvas id="canvasOutput2" className='bg-danger' width={480} height={400} ></canvas>
                </Col>
            </Row>
        </Container>

    )
}
