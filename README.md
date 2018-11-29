# React Popper Dropdown

[![npm version](https://badge.fury.io/js/react-popper-dropdown.svg)](https://badge.fury.io/js/react-popper-dropdown)
![NPM license](https://img.shields.io/github/license/energydrink9/react-popper-dropdown.svg)
[![npm](https://img.shields.io/npm/dm/react-popper-dropdown.svg)](https://www.npmjs.com/package/react-popper-dropdown)

This is a library made with React and React-Popper for creating a simple customizable dropdown.

React Popper Dropdown is written in functional programming style with ES2016 and Flow.


# Installation

You can install the library with NPM:

```bash
npm install –-save react-popper-dropdown
```

or with YARN:

```bash
yarn add react-popper-dropdown
```


# Usage

To use React Popper Dropdown, you have to import the library and its base types you intend to use, for example:

```javascript
import ReactPopperDropdown from "react-popper-dropdown"
```

then you can use it inside your component. For example:

```javascript
import React from 'react'
import ReactPopperDropdown from "react-popper-dropdown"

let choices = [
  {id:0, value:"choice 1"},
  {id:1, value:"choice 2"},
  {id:2, value:"choice 3"},
]

let value = choices[0]

class MyDropdown extends React.Component {

  render = () => <ReactPopperDropdown choices={choices} value={value} />

}
```


# Component Props

The ReactPopperDropdown component accepts the following props:

|Prop|Default|Description|
|---|---|---|
|choices| | Specifies the possibles value of dropdown|
|value| | Specifies the value of dropdown|
|idGetter|(element) => element.id | Specifies how to get the id of choice |
|labelGetter|(element) => element.label | Specifies how to get the label of choice |
|renderer|(value) => value| Specifies how to render the column value |
|enabled| true | Allows the user to change or not the value |
|onValueChange| | Allows to specify an event handler for the value change event|
|enableReset| true | Allows to user to reset the value|
|filterable| true |Show the filter textbox that Allows to user to filter the choices|
|popperContainer| document.body | When the popper element is attached|
|className| | Css classes to apply to the component|
|autoWidth|false| Enable the automatically adjusts the width of the popup element|


# Conclusion

Pull requests are welcome, enjoy your react popper dorpdown!


## Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/energydrink9/functional-data-grid/contributors"><img src="https://opencollective.com/functional-data-grid/contributors.svg?width=890&button=false" /></a>


