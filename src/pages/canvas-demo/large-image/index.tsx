import React, { useEffect, useRef, useState, memo } from 'react';
import image02 from '../images/02.jpg';
import image03 from '../images/03.jpeg';
import image04 from '../images/04.jpeg';
import ImageLoader from './ImageLoader';

const LargeImage = memo(() => {
    const canvasRef = useRef(null)
    const canvas2Ref = useRef(null)
    const [loader, setLoader] = useState<ImageLoader>();
    useEffect(() => {
        if ((window as any).loader) {
            return;
        }
        const canvas = canvasRef.current! as HTMLCanvasElement;
        const canvas2 = canvas2Ref.current! as HTMLCanvasElement;
        const loader = new ImageLoader(canvas, canvas2);
        (window as any).loader = loader;
        loader.init();
        setLoader(loader);
    }, []);

    const handleAdd = () => {
        loader?.handleScale(1.2);
    }
    const handleDel = () => {
        loader?.handleScale(0.8);
    }
    return <div>
        <canvas ref={canvasRef} key="1" style={{ border: '1px solid green' }} id="canvas" width="800" height="600"></canvas>
        <canvas ref={canvas2Ref} key="2" id="canvas2" style={{ display: 'none' }}></canvas>
        <div></div>
        <button onClick={handleAdd}>放大</button><button onClick={handleDel}>缩小</button>
    </div >
})

export default LargeImage;