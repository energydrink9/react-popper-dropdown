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
  margin-right: 2px;
  display: flex;
  cursor: pointer;
}
.react-popper-dropdown__select__open-button, .react-popper-dropdown__select__close-button {
  display: flex;
}
.react-popper-dropdown__select__open-button::after, .react-popper-dropdown__select__close-button::after {
  content: "";
	border-left: 4px solid transparent;
	border-right: 4px solid transparent;
  margin: auto;
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
  content: "\00d7";
  margin: auto;
  font-size: 1.5em;
}
.react-popper-dropdown__select__reset-button:hover::after {
  color: #0ff;
}

.react-popper-dropdown__popper {
  
}

.react-popper-popup__dropdown {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: solid 1px #ccc;
}
.react-popper-popup__filter {
  flex-grow: 1;
  padding:4px;
  border-bottom: 1px solid rgb(170, 170, 170);
}
.react-popper-popup__filter input {
  width: 100%;
}
.react-popper-popup__choices {
  display: flex;
  flex-direction: column;
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
  min-height: 20px;
  overflow: hidden;
}
.react-popper-popup__choices__choice:hover {
  background-color: #eee;
}
.react-popper-popup__choices__choice--selected {
  background-color: #00ffff24;
}
`

export default StyledReactPopperDropdown