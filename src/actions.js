import React from 'react';
import {createStore} from 'redux';

const CHANGE_VALUE = "CHANGE_VALUE"

const changeValue = (param, value) => {
    return {
        type: CHANGE_VALUE,
        payload: {
            param,
            value
        }
    }
}



const crank = (up, down, angle) => (up**2 - down**2)/ (2*(down*Math.cos(Math.PI/2 - angle) - up*Math.cos(Math.PI/2 + angle)))

const driver = (up, down, angle) => Math.sqrt(crank(up, down, angle)**2 + up**2 - 2*crank(up, down, angle)*up*Math.cos(Math.PI/2 - angle))


export {CHANGE_VALUE, changeValue}
