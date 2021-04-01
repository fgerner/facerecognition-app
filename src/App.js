import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from "react-particles-js";
import React, {Component} from "react";
import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: 'process.env.API_KEY'
});


const particlesOptions = {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        line_linked: {
            shadow: {
                enable: true,
                color: "#3CA9D1",
                blur: 5
            }
        }
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: ''
        }
    }


    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models
            .predict(
                // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
                // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
                // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
                // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
                // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
                // so you would change from:
                // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
                // to:
                // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)
            .then(response => {
                console.log('response: ', response.outputs[0].data.regions[0].region_info.bounding_box)
                if (response) {
                    fetch('http://localhost:3000/image', {
                        method: 'put',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, {entries: count}))
                        })

                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="App">
                <Particles className={'particles'}
                           params={
                               particlesOptions
                           }
                />
                <Navigation/>
                <Logo/>
                <Rank/>
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition imageUrl={this.state.imageUrl} />
            </div>
        );
    }
}

export default App;
