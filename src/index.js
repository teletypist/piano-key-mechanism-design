import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import styled from 'styled-components';
import store from './store'
import {Provider} from 'react-redux';
import ParamsContainer, {Container} from './components';
import Diagram from './diagram'



class App extends React.Component {
    
    render() {
        var {ps, values} = this.props;
        return <Container>
            <h2>Keyboard Planner</h2>
            <ParamsContainer />
            <Diagram width={"" + (190*1.15625) + "mm"} viewBox="-170 0 190 140"/>
        </Container>
    }
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
