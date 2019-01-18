import {createStore} from 'redux';
import {Params, CHANGE_VALUE} from './actions'
import {calculateValues} from './functions'

const appid = "com.soundchasing.keyboard"

const initialContent = [
    {
        name: "Offset",
        unit: "mm",
        min: 10,
        max: 150,
        init: 30,
        step: 1,
        desc: "Offset of base of fixed length member from rear of piano key",
        key: "offset",
    },
    {
        name: "Stretch",
        unit: "mm",
        min: 40,
        max: 150,
        init: 80,
        step: 1,
        desc: "Distance between mount points between the where the driver and fixed members",
        key: "stretch",
    },
    {
        name: "Nominal Height",
        unit: "mm",
        min: 10,
        max: 80,
        init: 25,
        step: 0.5,
        desc: "Distance between base mount point and key mount point",
        key: "nominalHeight",
    },
    {
        name: "White Key Length",
        unit: "mm",
        min: 100,
        max: 170,
        init: 150,
        step: 5,
        desc: "Key length for a white key",
        key: "keyLength",
    },
    {
        name: "Driver Surplus",
        unit: "%",
        min: 2,
        max: 10,
        init: 5,
        step: 0.1,
        desc: "Proportion be which the lower driver is greater than the slide",
        key: "driverSup",
    },
    {
        name: "Lever Length",
        unit: "mm",
        min: 150,
        max: 300,
        init: 235,
        step: 5,
        desc: "Distance from the front of the white key to the fulcrum of the simulated key",
        key: "leverLength",
    },
    {
        name: "Forward Dip",
        unit: "mm",
        min: 5.0,
        max: 15.0,
        init: 10.3,
        step: 0.1,
        desc: "Distance that the key depresses down when pressed",
        key: "forwardDip",
    },
    {
        name: "Pin Radius",
        unit: "mm",
        min: 1.5,
        max: 4.0,
        init: 2.5,
        step: 0.1,
        desc: "Radius of connecting pins",
        key: "pinRadius",
    },
    {
        name: "Member Width",
        unit: "mm",
        min: 5.0,
        max: 15.0,
        init: 10.0,
        step: 0.1,
        desc: "Width of Member pieces",
        key: "memberWidth",
    },
    {
        name: "Key Depth",
        unit: "mm",
        min: 10.0,
        max: 25.0,
        init: 15.0,
        step: 0.1,
        desc: "Thickness of key member",
        key: "keyDepth",
    },
    {
        name: "Current Travel",
        unit: "%",
        min: 0,
        max: 100,
        init: 0,
        step: 5,
        desc: "How much the key is pressed in the diagram",
        key: "travel",
    },
]

function initialValues(initialContent) {
    return initialContent.reduce((obj, {key, init}) => ({...obj, [key]: init}), {})
}

const initialState = {
    appid,
    content: initialContent,
    values: calculateValues(initialValues(initialContent)),
    members: [],
}

const loadState = () => {
	try {
		const serializedState = localStorage.getItem(appid);
		if (serializedState === null) {
			return undefined
		}
		return JSON.parse(serializedState)
	} catch (e) {
		return undefined
	}
};

/*
* Save state to local storage for future hydration
* */
const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(appid, serializedState);
	} catch (e) {
		// Ignore
	}
};

let persistedState = loadState();
if (!persistedState || persistedState.appid !== appid)
    persistedState = undefined

const keyCalculate = (prev=initialState, action) => {
    switch (action.type) {
        case CHANGE_VALUE:
            var {param, value} = action.payload;
            return {
                ...prev,
                values: calculateValues({
                    ...prev.values,
                    [param]: parseFloat(value),
                })
            };
        default:
            return prev;
    }
}



var store = createStore(keyCalculate, persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Update local storage on state change
store.subscribe(() => {
	saveState(store.getState())
});



export default store
