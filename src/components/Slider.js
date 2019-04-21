import React from 'react'
import Input from './Input'
import styled from 'styled-components'

const StyledSlider = styled(Input)`
  width: 0;
  -webkit-appearance: slider-vertical;
  margin: 18px 0;
  //
  //&:focus {
  //  outline: none;
  //}
  //&::-webkit-slider-runnable-track {
  //  width: 100%;
  //  height: 8.4px;
  //  cursor: pointer;
  //  animate: 0.2s;
  //  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  //  background: #3071a9;
  //  border-radius: 1.3px;
  //  border: 0.2px solid #010101;
  //}
  //&::-webkit-slider-thumb {
  //  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  //  border: 1px solid #000000;
  //  height: 36px;
  //  width: 16px;
  //  border-radius: 3px;
  //  background: #ffffff;
  //  cursor: pointer;
  //  -webkit-appearance: none;
  //  margin-top: -14px;
  //}
  //&:focus::-webkit-slider-runnable-track {
  //  background: #367ebd;
  //}
  //&::-moz-range-track {
  //  width: 100%;
  //  height: 8.4px;
  //  cursor: pointer;
  //  animate: 0.2s;
  //  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  //  background: #3071a9;
  //  border-radius: 1.3px;
  //  border: 0.2px solid #010101;
  //}
  //&::-moz-range-thumb {
  //  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  //  border: 1px solid #000000;
  //  height: 36px;
  //  width: 16px;
  //  border-radius: 3px;
  //  background: #ffffff;
  //  cursor: pointer;
  //}
`

export default function Slider({ min, max, stepSize, onChange, ...props }) {
  return (
    <div>
      <StyledSlider
        type="range"
        orient="vertical"
        min={min}
        max={max}
        step={stepSize}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
      {props.value}
    </div>
  )
}
