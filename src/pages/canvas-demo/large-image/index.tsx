import React, { useEffect } from 'react';
import image02 from '../images/02.jpg';

const LargeImage = () => {
    useEffect(() => {
        const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            ctx?.drawImage(img, 0, 0);
        }
        img.onerror = (e) => {
            console.error(e);
        };
        img.src = image02;

    }, []);

    return <div>
        <canvas id="canvas" width="800" height="600"></canvas>
        <canvas id="canvas2" style={{ display: 'none' }}></canvas>
    </div>
}

export default LargeImage;