import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
    return (
        <div className={'center'}>
            <div className={'absolute mt2'}>
                <img id={'inputimage'} src={imageUrl} alt="analysed" width='500px' height='auto'/>
                <div className={'bounding-box'}style={{
                    top: box.leftcol,
                    right: box.rightcol,
                    bottom: box.bottomRow,
                    left: box.leftcol}}
                />
            </div>
        </div>
    )
}


export default FaceRecognition;
