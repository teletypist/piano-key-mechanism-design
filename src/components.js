import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {changeValue} from './actions';

const Container = styled.div`
    max-width: 950px;
    margin: 0 auto;
`

const Label = styled.label`
    text-align: right;
    margin-right: 1rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    font-size: 0.8rem;
`

const Horizontal = styled.div`
    display: flex;
    align-items: centered;
`

const Value = styled.span`
    font-size: 0.8rem;
    margin-left: 1rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
`

const Parameter = ({name, min, max, on_zero, value, onChange, unit, step}) => <Horizontal>
    <Label>{name}</Label>
    <input type="range" min={min} max={max} value={value} onChange={onChange} step={step}/>
    {(on_zero && value===0) ?
        <Value>{on_zero}</Value> :
        <Value>{value.toFixed(2) + unit}</Value>
    }
</Horizontal>

const ParamsContainer = ({params, dispatch}) => <div>
    {params.map(({name, unit, min, max, value, step, on_zero, desc, key}, index) =>
        <Parameter name={name} min={min} max={max} step={step} value={value} unit={unit} on_zero={on_zero} onChange={(ev) => dispatch(changeValue(key, ev.target.value))} />
    )}
</div>

const mapStateToProps = (state) => {
    var {content, values} = state;
    return {
        params: content.map((cont, index) => {
            var out = {...cont}
            out['value'] = values[cont.key];
            return out;
        })
    }
}

export default connect(mapStateToProps)(ParamsContainer);
export {Container, Label, Horizontal, Value, Parameter}
