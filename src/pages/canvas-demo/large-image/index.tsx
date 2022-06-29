import React, { useEffect, useRef, useState, memo } from 'react';
import ImageLoader from './ImageLoader';
import "./index.css";

const LargeImage = memo(() => {
    const canvasRef = useRef(null)
    const [loader, setLoader] = useState<ImageLoader>();
    const [selectIndex, setSelectIndex] = useState(0);
    useEffect(() => {
        if ((window as any).loader) {
            return;
        }
        const canvas = canvasRef.current! as HTMLCanvasElement;
        const loader = new ImageLoader(canvas);
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

    const handleClick = (index: number) => {
        loader?.setImage(index);
        setSelectIndex(index);
    }
    const renderImage = () => {
        return loader?.images.map((item, index) => {
            let className = ""
            if (selectIndex == index) {
                className = "active";
            }
            return <li onClick={(e) => {
                e.preventDefault();
                handleClick(index);
            }} className={className}>image_{index + 1}</li>
        });
    }
    return <div>
        <div className="large-image">
            <ul className="left">{renderImage()}</ul>
            <canvas className="right" ref={canvasRef} key="1" style={{ border: '1px solid green' }} id="canvas" width="1000" height="1000"></canvas>
        </div>
        <button onClick={handleAdd}>放大</button><button onClick={handleDel}>缩小</button>
    </div >
})

export default LargeImage;