// @flow

import ReactPopperDropdown from './ReactPopperDropdown'
import styled from "styled-components";

const StyledReactPopperDropdown = styled(ReactPopperDropdown)`

.react-popper-dropdown {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.react-popper-dropdown--disabled {
  color: #999;
}
.react-popper-dropdown__select {
  display: flex;
  width: 100%;
  border: solid 1px #666;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
}
.react-popper-dropdown__value {
  flex-grow: 1;
  flex-shrink: 1;
  white-space: nowrap;
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
}
.react-popper-dropdown__select__reset-button {
  width: 12px;
  margin-right: 4px;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;
  position: relative;
  text-align: center;
}
.react-popper-dropdown__select__open-button, .react-popper-dropdown__select__close-button {
  width: 8px;
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
  text-align: center;
}
.react-popper-dropdown__select__open-button::after, .react-popper-dropdown__select__close-button::after {
  position: absolute;
  content: "";
  top: 50%;
	width: 0;
	height: 0;
	border-left: 4px solid transparent;
	border-right: 4px solid transparent;
  margin-top: -3px;
  right: 0;
}
.react-popper-dropdown__select__open-button::after {
	border-top: 7px solid #666;
}
.react-popper-dropdown__select__close-button::after {
	border-bottom: 7px solid #666;
}
.react-popper-dropdown__select__open-button:hover::after {
  border-top-color: #0ff; 
}
.react-popper-dropdown__select__close-button:hover::after {
  border-bottom-color: #0ff; 
}
.react-popper-dropdown--disabled .react-popper-dropdown__select__open-button::after {
  border-top-color: #ccc;
}
.react-popper-dropdown--disabled .react-popper-dropdown__select__close-button::after {
  border-bottom-color: #ccc;
}
.react-popper-dropdown--disabled .react-popper-dropdown__select__reset-button::after {
  color: #ccc;
}
.react-popper-dropdown__select__reset-button::after {
  position: absolute;
  content: "\00d7";
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -6px;
  font-size: 1.5em;
}
.react-popper-dropdown__select__reset-button:hover::after {
  color: #0ff;
}

.react-popper-dropdown__popper {
  max-width: 250px
}

.react-popper-popup__dropdown {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: solid 1px #ccc;
}
.react-popper-popup__filter {
  flex-grow: 1;
  padding-left: 2px 4px;
}
.react-popper-popup__filter input {
  width: 100%;
}
.react-popper-popup__choices {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden
  white-space: nowrap;
  text-overflow: ellipsis;
}
.react-popper-popup__choices__choice {
  padding: 4px 4px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.react-popper-popup__choices__choice:hover {
  background-color: #eee;
}
.react-popper-popup__choices__choice--selected {
  background-color: #00ffff24;
}
`

export default StyledReactPopperDropdown