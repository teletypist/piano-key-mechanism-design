import React from 'react';
import {connect} from 'react-redux';

const ps = {
    params: [
        {
            name: "Offset",
            min: 30,
            max: 150,
            init: 0,
            desc: "Offset of base of fixed length member from front of piano key",
            key: Params.OFFSET,
        },
        {
            name: "Stretch",
            min: 40,
            max: 150,
            init: 80,
            desc: "Distance between mount points between the where the driver and fixed members",
            key: Params.STRETCH,
        },
        {
            name: "Nominal Height",
            min: 10,
            max: 80,
            init: 25,
            desc: "Distance between base mount point and key mount point",
            key: Params.NOMINAL_HEIGHT,
        },
        {
            name: "Crank Angle",
            min: 2,
            max: 60,
            init: 7.5,
            desc: "Angle over which the crank operates",
            key: Params.CRANK_ANGLE,
        },
        {
            name: "Lever Length",
            min: 150,
            max: 300,
            init: 235,
            desc: "Distance from the front of the white key to the fulcrum of the simulated key",
            key: Params.LEVER_LENGTH,
        },
        {
            name: "Forward Dip",
            min: 5.0,
            max: 15.0,
            init: 10.3,
            desc: "Distance that the key depresses down when pressed",
            key: Params.FORWARD_DROP,
        },
        {
            name: "Part Tolerance Factor",
            min: 0,
            max: 100,
            init: 0,
            desc: "Applied rounding factor for parts",
            key: Params.TOLERANCE,
        },
    ]
}

const CHANGE_VALUE = "CHANGE_VALUE"

const Params = {
    OFFSET: "OFFSET",
    STRETCH: "STRETCH",
    NOMINAL_HEIGHT: "NOMINAL_HEIGHT",
    CRANK_ANGLE: "CRANK_ANGLE",
    LEVER_LENGTH: "LEVER_LENGTH",
    FORWARD_DROP: "FORWARD_DROP",
    TOLERANCE: "TOLERANCE",
}

const changeValue = (param, value) => {
    return {
        type: CHANGE_VALUE,
        payload: {
            param,
            value
        }
    }
}

export {ps}
