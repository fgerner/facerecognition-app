import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Particles from "react-particles-js";
import React, {Component} from "react";
import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: 'process.env.REACT_APP_API_KEY'
});

const particlesOptions = {
    particles: {
        number: {
            value: 100,
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
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false
        }
    }


    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftcol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightcol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
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
                // if (response) {
                //     fetch('http://localhost:3000/image', {
                //         method: 'put',
                //         headers: {'Content-Type': 'application/json'},
                //         body: JSON.stringify({
                //             id: this.state.user.id
                //         })
                //     })
                //         .then(response => response.json())
                //         .then(count => {
                //             this.setState(Object.assign(this.state.user, {entries: count}))
                //         })
                //
                // }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState({isSignedIn: false});
        } else if (route === 'home') {
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    }

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state
        return (
            <div className="App">
                <Particles className={'particles'}
                           params={
                               particlesOptions
                           }
                />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {route === 'home'
                    ?
                    <div>
                        <Logo/>
                        <Rank/>
                        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                        <FaceRecognition box={box} imageUrl={imageUrl}/>
                    </div>
                    : (
                        route === 'signin'
                            ? < SignIn onRouteChange={this.onRouteChange}/>
                            : <Register onRouteCharge={this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
}

export default App;
