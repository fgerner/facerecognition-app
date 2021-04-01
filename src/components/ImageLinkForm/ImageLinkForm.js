import React from 'react';
import './ImageLinkForm.css'


const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className={'f3'}>
                {'This app will find any faces in the pictures you link to, like frigging magic!!'}
            </p>
            <div className={'center'}>
                <div className={'center form pa4 br3 shadow-5'}>
                    <input className={'f4 pa2 w-70 center'} type="text" placeholder={'Link to image'} onChange={onInputChange}/>
                    <button className={'w-30 grow f4 link ph3 pv2 dib white bg-light-purple'} onClick={onButtonSubmit}>Work it out</button>
                </div>
            </div>
        </div>
    )
}


export default ImageLinkForm;
