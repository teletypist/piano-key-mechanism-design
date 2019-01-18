
const hyp = (x, y) => Math.sqrt(x**2 + y**2)
const dis = (p1, p2) => hyp(p1.x-p2.x, p1.y-p2.y)
const mid = (p1, p2) => ({x: (p1.x + p2.x)/2, y: (p1.y+p2.y)/2})
const ang = (p1, p2) => Math.atan2(p2.y-p1.y, p2.x-p1.x)
const crank = (upSlide, upAngle, downSlide, downAngle) => (upSlide**2 - downSlide**2) / (2*(upSlide*Math.cos(upAngle) - downSlide*Math.cos(downAngle)))
const driver = (crank, slide, angle) => Math.sqrt(crank**2 + slide**2 - 2*crank*slide*Math.cos(angle))

const circleIntersection = (circle1, circle2, err=0.000001) => {
    var x1, y1, r1, x2, y2, r2, reach;
    x1 = circle1.x
    y1 = circle1.y
    r1 = circle1.r
    x2 = circle2.x
    y2 = circle2.y
    r2 = circle2.r
    reach = Math.sqrt((x1-x2)**2 + (y1-y2)**2)

    if (reach > r1 + r2 || 
        reach + Math.min(r1, r2) < Math.max(r1, r2))
    {
        throw "No Solution"
        return []
    }

    var min = 0;
    var max = Math.PI
    var diff;
    var theta;
    do {
        theta = (max + min)/2.0
        diff = Math.sqrt((reach - r1*Math.cos(theta))**2 + (r1*Math.sin(theta))**2)
        if (diff > r2)
            max = theta
        else if (diff < r2)
            min = theta
    } while (Math.abs(diff - r2) > err)

    var ang = Math.atan2(y2-y1, x2-x1)
    if (theta < err || Math.abs(Math.PI - theta) < err)
        return [{x:x1 + r1*Math.cos(ang+theta), y:y1 + r1*Math.sin(ang+theta)}]
    else
        return [{x: x1 + r1*Math.cos(ang + theta), y: y1 + r1*Math.sin(ang+theta)},
                {x: x1 + r1*Math.cos(ang - theta), y: y1 + r1*Math.sin(ang-theta)}]
}

const leftMost = (res) => (!res) ? undefined :
    (res.length < 2) ? res[0] :
    (res[0].x < res[1].x) ? res[0] : res[1]

const rightMost = (res) => (!res) ? undefined :
    (res.length < 2) ? res[0] :
    (res[0].x < res[1].x) ? res[1] : res[0]

const topMost = (res) => (!res) ? undefined :
    (res.length < 2) ? res[0] :
    (res[0].y > res[1].y) ? res[0] : res[1]

const bottomMost = (res) => (!res) ? undefined :
    (res.length < 2) ? res[0] :
    (res[0].y > res[1].y) ? res[1] : res[0]

const t = (y) => (!isNaN(y)) ? 100-y:
    {x: y.x, y: 100-y.y}

const calculations = [
    //Forward base
    ({offset}) => ({
        forwardBase: {
            x: -offset,
            y: 0
        },
    }),
    //Rearward base
    ({offset, stretch}) => ({
        rearwardBase: {
            x: -(offset+stretch),
            y: 0,
        },
    }),
    //Up Theta
    ({nominalHeight, stretch}) => ({
        upTheta: Math.atan(nominalHeight/stretch),
    }),
    //Up Forward Key
    ({forwardBase, nominalHeight}) => ({
        upForwardKey: {
            x: forwardBase.x,
            y: nominalHeight,
        },
    }),
    //Up Fixed Joint
    ({upForwardKey, rearwardBase}) => ({
        upFixedJoint : mid(upForwardKey, rearwardBase),
    }),
    //Up Rearward Key
    ({upForwardKey, stretch}) => ({
        upRearwardKey: {
            x: upForwardKey.x - stretch,
            y: upForwardKey.y,
        },
    }),
    //Fixed Length
    ({rearwardBase, upForwardKey}) => ({
        fixedLength: dis(rearwardBase, upForwardKey),
    }),
    //Depression Angle
    ({leverLength, forwardDip}) => ({
        depressionAngle: Math.atan(forwardDip/leverLength),
    }),
    //Forward Key Dip
    ({depressionAngle, leverLength, offset}) => ({
        forwardKeyDip: (leverLength-offset) * Math.sin(depressionAngle),
    }),
    //Down Theta
    ({forwardKeyDip, nominalHeight, fixedLength}) => ({
        downTheta: Math.asin((nominalHeight - forwardKeyDip)/fixedLength),
    }),
    //Down Forward Key
    ({downTheta, fixedLength, rearwardBase}) => ({
        downForwardKey: {
            x: rearwardBase.x + fixedLength*Math.cos(downTheta),
            y: rearwardBase.y + fixedLength*Math.sin(downTheta),
        },
    }),
    //Down Fixed Joint
    ({downForwardKey, rearwardBase}) => ({
        downFixedJoint: mid(downForwardKey, rearwardBase),
    }),
    //Down Rearward Key
    ({depressionAngle, downForwardKey, stretch}) => ({
        downRearwardKey: {
            x: downForwardKey.x - stretch*Math.cos(depressionAngle),
            y: downForwardKey.y + stretch*Math.sin(depressionAngle),
        },
    }),
    //Up Slide Length
    ({fixedLength}) => ({
        upSlideLength: fixedLength/2,
    }),
    //Base Driver Length
    ({upSlideLength, driverSup}) => ({
        baseDriver: upSlideLength * (100+driverSup)/200,
    }),
    //Up Base Crank Joint
    ({baseDriver, forwardBase, upFixedJoint}) => ({
        upBaseCrankJoint: leftMost(circleIntersection({...forwardBase, r: baseDriver}, {...upFixedJoint, r: baseDriver})),
    }),
    //Down Base Crank Joint
    ({baseDriver, forwardBase, downFixedJoint}) => ({
        downBaseCrankJoint: leftMost(circleIntersection({...forwardBase, r: baseDriver}, {...downFixedJoint, r: baseDriver})),
    }),
    //Up Crank Angle
    ({upBaseCrankJoint, upFixedJoint}) => ({
        upCrankAngle: ang(upBaseCrankJoint, upFixedJoint),
    }),
    //Down Crank Angle
    ({downBaseCrankJoint, downFixedJoint}) => ({
        downCrankAngle: ang(downBaseCrankJoint, downFixedJoint),
    }),
    //Down Slide Length
    ({downRearwardKey, downFixedJoint}) => ({
        downSlideLength: dis(downRearwardKey, downFixedJoint),
    }),
    //Up Slide Angle
    ({upFixedJoint, upRearwardKey}) => ({
        upSlideAngle: ang(upFixedJoint, upRearwardKey),
    }),
    //Down Slide Angle
    ({downFixedJoint, downRearwardKey}) => ({
        downSlideAngle: ang(downFixedJoint, downRearwardKey),
    }),
    //Key Crank
    ({upSlideLength, downSlideLength, upCrankAngle, upSlideAngle, downCrankAngle, downSlideAngle}) => ({
        keyCrank: crank(upSlideLength, upSlideAngle-upCrankAngle, downSlideLength, downSlideAngle-downCrankAngle),
    }),
    //Up Key Crank Joint
    ({keyCrank, upCrankAngle, upFixedJoint}) => ({
        upKeyCrankJoint: {
            x: upFixedJoint.x + keyCrank*Math.cos(upCrankAngle),
            y: upFixedJoint.y + keyCrank*Math.sin(upCrankAngle),
        },
    }),
    //Down Key Crank Joint
    ({keyCrank, downCrankAngle, downFixedJoint}) => ({
        downKeyCrankJoint: {
            x: downFixedJoint.x + keyCrank*Math.cos(downCrankAngle),
            y: downFixedJoint.y + keyCrank*Math.sin(downCrankAngle),
        },
    }),
    //From Up Joint Key Driver
    ({upKeyCrankJoint, upRearwardKey}) => ({
        fromUpJointKeyDriver: dis(upKeyCrankJoint, upRearwardKey),
    }),
    //Calculated Joint Key Driver
    ({keyCrank, upCrankAngle, upSlideLength, upSlideAngle}) => ({
        keyDriver: driver(keyCrank, upSlideLength, upSlideAngle-upCrankAngle),
    }),
    //From Down Joint Key Driver
    ({downKeyCrankJoint, downRearwardKey}) => ({
        fromDownJointKeyDriver: dis(downKeyCrankJoint, downRearwardKey),
    }),
    //Now Theta
    ({upTheta, downTheta, travel}) => ({
        nowTheta: downTheta*travel/100 + upTheta*(100-travel)/100,
    }),
    //Now Forward Key
    ({nowTheta, fixedLength, rearwardBase}) => ({
        nowForwardKey: {
            x: rearwardBase.x + fixedLength*Math.cos(nowTheta),
            y: rearwardBase.y + fixedLength*Math.sin(nowTheta),
        },
    }),
    //Now Fixed Joint
    ({rearwardBase, nowForwardKey}) => ({
        nowFixedJoint: mid(rearwardBase, nowForwardKey),
    }),
    //Now Base Crank Joint
    ({forwardBase, nowFixedJoint, baseDriver}) => ({
        nowBaseCrankJoint: bottomMost(circleIntersection({...forwardBase, r:baseDriver}, {...nowFixedJoint, r:baseDriver})),
    }),
    //Now Crank Angle
    ({nowBaseCrankJoint, nowFixedJoint}) => ({
        nowCrankAngle: ang(nowBaseCrankJoint, nowFixedJoint),
    }),
    //Now Key Crank Joint
    ({nowBaseCrankJoint, nowCrankAngle, keyCrank, baseDriver}) => ({
        nowKeyCrankJoint: {
            x: nowBaseCrankJoint.x + (keyCrank+baseDriver)*Math.cos(nowCrankAngle),
            y: nowBaseCrankJoint.y + (keyCrank+baseDriver)*Math.sin(nowCrankAngle),
        },
    }),
    //Now Rearward Key
    ({nowForwardKey, stretch, nowKeyCrankJoint, keyDriver}) => ({
        nowRearwardKey: leftMost(circleIntersection({...nowForwardKey, r: stretch}, {...nowKeyCrankJoint, r:keyDriver})),
    }),
    //Now Key Angle
    ({nowRearwardKey, nowForwardKey}) => ({
        keyAngle: ang(nowRearwardKey, nowForwardKey),
    }),
    //Up Key Angle
    ({upRearwardKey, upForwardKey}) => ({
        upKeyAngle: ang(upRearwardKey, upForwardKey),
    }),
    //Up Key Projection
    ({upKeyAngle, upKeyCrankJoint, upRearwardKey, keyDriver}) => ({
        upKeyProjection: keyDriver*Math.sin(ang(upRearwardKey, upKeyCrankJoint) - upKeyAngle),
    }),
    //Down Key Angle
    ({downRearwardKey, downForwardKey}) => ({
        downKeyAngle: ang(downRearwardKey, downForwardKey),
    }),
    //Down Key Projection
    ({downKeyAngle, downKeyCrankJoint, downRearwardKey, keyDriver}) => ({
        downKeyProjection: keyDriver*Math.sin(ang(downRearwardKey, downKeyCrankJoint) - downKeyAngle),
    }),
    //Up Base Projection
    ({forwardBase, baseDriver, upBaseCrankJoint}) => ({
        upBaseProjection: baseDriver*Math.sin(Math.PI - ang(forwardBase, upBaseCrankJoint)),
    }),
    //Down Base Projection
    ({forwardBase, baseDriver, downBaseCrankJoint}) => ({
        downBaseProjection: baseDriver*Math.sin(Math.PI - ang(forwardBase, downBaseCrankJoint)),
    }),
    //Up Key Front
    ({upForwardKey, offset}) => ({
        upFrontKey: {
            x: upForwardKey.x + offset, 
            y: upForwardKey.y
        },
    }),
    //Down Key Front
    ({downForwardKey, offset, downKeyAngle}) => ({
        downFrontKey: {
            x: downForwardKey.x + offset*Math.cos(downKeyAngle),
            y: downForwardKey.y + offset*Math.sin(downKeyAngle),
        },
    }),
    //Up Key Rear
    ({upForwardKey, keyLength, offset}) => ({
        upRearKey: {
            x: upForwardKey.x + offset - keyLength,
            y: upForwardKey.y,
        },
    }),
    //Down Key Rear
    ({downForwardKey, keyLength, offset, downKeyAngle}) => ({
        downRearKey: {
            x: downForwardKey.x + (offset-keyLength)*Math.cos(downKeyAngle),
            y: downForwardKey.y + (offset-keyLength)*Math.sin(downKeyAngle),
        },
    }),
    //Forward Key Foot
    ({upForwardKey, memberWidth, downFrontKey, upBaseProjection, downBaseProjection, depressionAngle}) => ({
        forwardKeyFoot: (downFrontKey.y + memberWidth/2 + Math.max(Math.abs(upBaseProjection), Math.abs(downBaseProjection)))/Math.cos(depressionAngle) -1
    }),
    //Up Key Forward Foot
    ({upFrontKey, forwardKeyFoot}) => ({
        upFrontKeyFoot: {
            x: upFrontKey.x,
            y: upFrontKey.y - forwardKeyFoot,
        },
    }),
    //Down Key Forward Foot
    ({downFrontKey, forwardKeyFoot, depressionAngle}) => ({
        downFrontKeyFoot: {
            x: downFrontKey.x - forwardKeyFoot*Math.sin(depressionAngle),
            y: downFrontKey.y - forwardKeyFoot*Math.cos(depressionAngle),
        },
    }),
    //Inset
    () => ({
        frontFootInset: 12,
    }),
    () => ({
        frontFootInwardRise: 2,
    }),
    //Up Key Inward Foot
    ({upFrontKeyFoot, frontFootInset, frontFootInwardRise}) => ({
        upFrontKeyInwardFoot: {
            x: upFrontKeyFoot.x - frontFootInset,
            y: upFrontKeyFoot.y + frontFootInwardRise
        },
    }),
    //Down Key Inward Foot
    ({downFrontKeyFoot, frontFootInset, frontFootInwardRise, depressionAngle}) => ({
        downFrontKeyInwardFoot: {
            x: downFrontKeyFoot.x - frontFootInset*Math.cos(depressionAngle) + frontFootInwardRise*Math.sin(depressionAngle),
            y: downFrontKeyFoot.y + frontFootInwardRise*Math.cos(depressionAngle) + frontFootInset*Math.sin(depressionAngle),
        },
    }),
]

export const calculateValues = (values) => calculations.reduce((vals, func) => ({...vals, ...func(vals)}), values)

const keyShape = ({offset, memberWidth, upKeyProjection, downKeyProjection, upBaseProjection, downBaseProjection, keyLength, nominalHeight, upKeyForward, downFrontKey, downRearKey, depressionAngle, frontFootInset, frontFootInwardRise}) => {
    let keyDepth = memberWidth + Math.max(upKeyProjection, downKeyProjection);
    let baseDepth = memberWidth + Math.max(Math.abs(upBaseProjection), Math.abs(downBaseProjection))
    let inward = Math.min(offset, 30)
    let thick = memberWidth/2
    let bottom = thick-keyDepth
    let low = (downFrontKey.y+baseDepth-thick)/Math.cos(depressionAngle) - 1
    let lowRear = (downRearKey.y+baseDepth-thick)/Math.cos(depressionAngle) - 1
    let wall = 2.0
    return ['M', 0, low,
            'L', -frontFootInset, low-frontFootInwardRise,
            'L', -frontFootInset, low-7,
            'L', -5, low-10,
            'L', -5, thick-6,
            'L', -8, thick-memberWidth,
            'L', -inward+2*thick+wall, thick-memberWidth,
            'L', -inward+thick+wall, 0,
            'L', -inward+wall, thick,
            'L', -keyLength + memberWidth, thick,
            'L', -keyLength + thick, lowRear-1,
            'L', -keyLength, lowRear,
            'L', -keyLength, thick,
            'L', -keyLength, thick-keyDepth,
            'L', 0, thick-keyDepth,
            'Z'].join(" ");
}

const baseShape = ({offset}) => []


export const membersFromValues = (v) => [
    {...t({x: v.nowForwardKey.x + v.offset*Math.cos(v.keyAngle), y: v.nowForwardKey.y + v.offset*Math.sin(v.keyAngle)}), angle: ang(v.nowRearwardKey, v.nowForwardKey), length: v.keyLength, noJoint: true, shape: keyShape(v)},
    {...t(v.rearwardBase), angle: v.nowTheta, length: v.fixedLength},
    {...t(v.forwardBase), angle: ang(v.forwardBase, v.nowBaseCrankJoint), length: v.baseDriver},
    {...t(v.nowBaseCrankJoint), angle: ang(v.nowBaseCrankJoint, v.nowFixedJoint), length: v.baseDriver},
    {...t(v.nowFixedJoint), angle: v.nowCrankAngle, length: v.keyCrank},
    {...t(v.nowKeyCrankJoint), angle: ang(v.nowKeyCrankJoint, v.nowRearwardKey), length: v.keyDriver},
    {...t({x: v.rearwardBase.x - (v.keyLength - v.offset - v.stretch), y: 0}), angle: 0, length: v.keyLength, box: true, noJoint: true, base: true},
]
