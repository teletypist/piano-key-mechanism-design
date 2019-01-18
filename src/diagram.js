import React from 'react';
import styled from 'styled-components'
import {connect} from 'react-redux'

import {
    utheta,
    dtheta,
    flength,
    memberLengths,
    membersFromValues} from './functions'

const mapStateForMember = (state) => ({
    thick: state.values.memberWidth/2,
    keyDepth: state.values.memberWidth + Math.max(state.values.upKeyProjection, state.values.downKeyProjection),
    baseDepth: state.values.memberWidth + Math.max(Math.abs(state.values.upBaseProjection), Math.abs(state.values.downBaseProjection)),
})

const mapStateForJoint = (state) => ({
    r: state.values.pinRadius,
})

const mapStateForBase = (state) => ({
    offset: state.values.memberWidth/2,
    thick: state.values.memberWidth/2,
})

const Member = connect(mapStateForMember)(({x, y, angle, length, thick=5.0, keyDepth, baseDepth, box, noJoint, base, shape}) => {
    var x1, x2, y1, y2;
    angle = -angle
    x1 = x
    y1 = y
    x2 = x1 + length*Math.cos(angle);
    y2 = y1 + length*Math.sin(angle);
    var px1, py1, px2, py2, px3, py3, px4, py4, path;
    px1 = x1 + thick*Math.sin(angle);
    py1 = y1 - thick*Math.cos(angle);
    px2 = x1 - thick*Math.sin(angle);
    py2 = y1 + thick*Math.cos(angle);
    px3 = x2 - thick*Math.sin(angle);
    py3 = y2 + thick*Math.cos(angle);
    px4 = x2 + thick*Math.sin(angle);
    py4 = y2 - thick*Math.cos(angle);
    path = ["M", px1, py1,
            "A", thick, thick, 0, 0, 0, px2, py2,
            "L", px3, py3,
            "A", thick, thick, 0, 0, 0, px4, py4,
            "Z"];
    return <g>
        {!noJoint &&
            <g>
                <Joint x={x1} y={y1}/>
                <Joint x={x2} y={y2}/>
            </g>
        }
        {!(box || shape) && <path d={path.join(" ")} fill="none" stroke="black" strokeWidth="0.1"/>}
        {(box || shape) &&
            <g transform={"translate(" + x + " " + y + ") rotate(" + (angle*180/Math.PI) + ")"} >
                {box && <rect x={0} y={-thick} width={length} height={(base)?baseDepth:keyDepth} fill="none" stroke="black" strokeWidth="0.1"/>}
                {shape && <path stroke="black" fill="none" strokeWidth="0.1" d={shape}/>}
            </g>
        }
    </g>
})

const Joint = connect(mapStateForJoint)(({x, y, r=2.5}) => <g>
    <circle cx={x} cy={y} r={r} stroke="black" fill="none" strokeWidth="0.1"/>
</g>)

const Mark = (pt) => {
    var {x, y} = t(pt)
    return <g>
        <circle cx={x} cy={y} r={0.2} stroke="black" fill="none" strokeWidth="0.2"/>
        <line x1={x} x2={x} y1={y+1.5} y2={y+2.5} strokeWidth="0.2" stroke="black"/>
        <line x1={x} x2={x} y1={y-1.5} y2={y-2.5} strokeWidth="0.2" stroke="black"/>
        <line x1={x+1.5} x2={x+2.5} y1={y} y2={y} strokeWidth="0.2" stroke="black"/>
        <line x1={x-1.5} x2={x-2.5} y1={y} y2={y} strokeWidth="0.2" stroke="black"/>
    </g>
}

const Base = connect(mapStateForBase)(({x, y, offset=5.0, thick=5.0}) => {
    var px1, py1, px2, py2, path;
    px1 = -offset-thick;
    py1 = offset;
    px2 = -thick*Math.sin(Math.PI/4);
    py2 = -thick*Math.cos(45*Math.PI/180);
    path = ["M", px1, py1,
            "L", px2, py2,
            "A", thick, thick, 0, 0, 1, -px2, py2,
            "L", -px1, py1,
            "Z"];
    return <g>
        <Joint x={x} y={y}/>
        <path transform={"translate(" + x + "," + y + ")"} d={path.join(" ")} strokeWidth="0.1" fill="none" stroke="black"/>
        {Array.apply(null, Array(21)).map((blank, off) =>
            <line x1={px1+x + (offset+thick)*off/10} y1={y+offset} x2={px1+x + (thick+offset)*off/10 - 0.5} y2={y+1+offset} stroke="black" strokeWidth="0.1" key={off}/>
        )}
    </g>
})
 
class Diagram extends React.Component {
    render() {
        var {members, joints, marks, bases, width, height, viewBox} = this.props;
        return <svg width={width} viewBox={viewBox}>
            {bases.map((base, index) => <Base {...base} key={index}/>)}
            {joints.map((joint, index) => <Joint {...joint} key={index} />)}
            {marks.map((mark, index) => <Mark {...mark} key={index} />)}
            {members.map((member, index) => <Member {...member} key={index} />)}
        </svg>
    }
}

const t = (y) => (!isNaN(y)) ? 100-y:
    {x: y.x, y: 100-y.y}

function mapStateToProps(state) {
    var {
            rearwardBase,
            forwardBase,
            downFrontKeyInwardFoot,
            downFrontKeyFoot,
            upFrontKeyInwardFoot,
            upFrontKeyFoot,
        } = state.values;
    return {
        bases: [
/*            {x: rearwardBase.x, y: t(0)},
            {x: forwardBase.x, y: t(0)},*/
        ],
        joints: [
        ],
        marks: [
            downFrontKeyInwardFoot,
            downFrontKeyFoot,
            upFrontKeyInwardFoot,
            upFrontKeyFoot,
        ],
        members: membersFromValues(state.values),
    }
}

export default connect(mapStateToProps)(Diagram)
