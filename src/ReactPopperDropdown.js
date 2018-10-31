// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import { List, OrderedMap } from 'immutable'
import {Manager, Reference, Popper} from 'react-popper'
import styled from 'styled-components'

type ReactPopperDropdownPropsType<T, ID> = {
  choices: List<T>,
  value: ?ID,
  idGetter: T => ID,
  labelGetter: T => string,
  renderer: (string, T) => React.Node,
  onValueChange: (?T) => void,
  enabled: boolean,
  enableReset: boolean,
  filterable: boolean,
  popperContainer: HTMLElement
};

type ReactPopperDropdownStateType<T, ID> = {
  choices: OrderedMap<ID, T>,
  open: boolean,
  filter: string
};

class ReactPopperDropdown<T, ID> extends React.PureComponent<ReactPopperDropdownPropsType<T, ID>, ReactPopperDropdownStateType<T, ID>> {

  ref: ?HTMLDivElement
  width: number = 0
  dropdown: HTMLDivElement

  static defaultProps = {
    choices: List(),
    value: null,
    idGetter: (el: Object) => el.id,
    labelGetter: (el: Object) => el.label,
    renderer: (value: string) => value,
    enabled: true,
    onValueChange: () => {},
    enableReset: true,
    filterable: true,
    popperContainer: document.body
  }

  constructor(props: ReactPopperDropdownPropsType<T, ID>) {
    super(props)
    this.state = {
      choices: OrderedMap(props.choices.map(c => [this.props.idGetter(c), c])),
      open: false,
      filter: ''
    }
  }

  componentDidMount = () => {
    if (this.ref != null)
      this.width = this.ref.getBoundingClientRect().width
  }

  render = () => {
    let element = this.props.popperContainer
    return <div className={`react-popper-dropdown ${!this.props.enabled ? 'react-popper-dropdown--disabled' : ''} ${this.state.open ? 'react-popper-dropdown--open' : ''}`} ref={ref => { this.ref = ref }}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref} className={`react-popper-dropdown__select`} onClick={() => this.toggleDropdown()}>
              { this.renderValue() }
              { this.props.enableReset && this.renderResetButton() }
              { this.state.open
                ? <div className="react-popper-dropdown__select__close-button"></div>
                : <div className="react-popper-dropdown__select__open-button"></div>
              }
            </div>
          )}
        </Reference>
        { this.state.open && element != null && ReactDOM.createPortal(
            <Popper placement={'bottom'}>
              {({ placement, ref, style }) => {

                  let styleWithWidth = {
                    ...style,
                    width: this.width + 'px'
                  }

                return (
                <div ref={ref} style={styleWithWidth} data-placement={placement} className="react-popper-dropdown__popper">
                  { this.renderDropDown() }
                </div>
              )}}
            </Popper>,
            element
          )
        }
      </Manager>
    </div>
  }

  renderDropDown = () => <ReactPopperDropdownDropdown
    filterable={this.props.filterable}
    filter={this.state.filter}
    onFilterChange={this.onFilterChange}
    choices={this.state.choices}
    value={this.props.value}
    idGetter={this.props.idGetter}
    labelGetter={this.props.labelGetter}
    renderer={this.props.renderer}
    onSelectChoice={this.onSelectChoice}
    onClose={() => { this.closeSelect() }}
  />

  toggleDropdown = () => {
    if (this.state.open)
      this.closeSelect()
    else
      this.openSelect()
  }

  onFilterChange = (filter: string) => {
    this.setState({
      filter: filter
    })
  }

  triggerOnChange = (c: ?T) => {
    this.props.onValueChange(c)
  }
  
  onSelectChoice = (c: T) => {
    this.triggerOnChange((c: any))
    this.closeSelect()
  }

  openSelect = () => {
    this.setState({
      open: true
    })
  }

  closeSelect = () => {
    this.setState({
      open: false,
      filter: ''
    })
  }

  resetValue = (event: Object) => {
    event.stopPropagation()
    this.triggerOnChange(null)
  }

  renderResetButton = () => <div onClick={this.resetValue} className={'react-popper-dropdown__select__reset-button'}>

  </div>

  renderValue = () => <div className="react-popper-dropdown__value">{ this.props.value == null ? this.renderEmptyValue() : this.props.renderer(this.props.labelGetter(this.state.choices.get(this.props.value)), this.state.choices.get(this.props.value)) }</div>

  renderEmptyValue = () => <span>{ String.fromCharCode(160) }</span>
}

type ReactPopperDropdownDropdownPropsType<T, ID> = {
  filter: string,
  filterable: boolean,
  onFilterChange: string => void,
  choices: OrderedMap<ID, T>,
  value: ?ID,
  idGetter: T => ID,
  labelGetter: T => string,
  renderer: (string, T) => React.Node,
  onSelectChoice: (c: T) => void,
  onClose: () => void
};

type ReactPopperDropdownDropdownStateType<ID> = {
  selected: ?ID
};

class ReactPopperDropdownDropdown<T, ID> extends React.PureComponent<ReactPopperDropdownDropdownPropsType<T, ID>, ReactPopperDropdownDropdownStateType<ID>> {

  filterInput: ?HTMLInputElement

  constructor(props: ReactPopperDropdownDropdownPropsType<T, ID>) {
    super(props)
    this.state = {
      selected: this.props.value
    }
  }

  componentDidMount = () => {
    if (this.filterInput != null)
      this.filterInput.focus()
    document.addEventListener('click', this.handleClickOutside, true)

    if (this.state.selected == null)
      this.selectNext()
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (event: Object) => {
    let ref = ReactDOM.findDOMNode(this) //eslint-disable-line
    if (ref != null && ! ref.contains(event.target)) {
      this.props.onClose()
      event.stopPropagation()
    }
  }

  render = () => <div className="react-popper-dropdown__dropdown">
    { this.props.filterable && this.renderFilter() }
    { this.renderChoices() }
  </div>

  renderFilter = () => <div className="react-popper-dropdown__filter">
    <input ref={ref => { this.filterInput = ref }} type="text" value={this.props.filter} onChange={(event: Object) => this.props.onFilterChange(event.target.value)} onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown} />
  </div>

  renderChoices = () => <div className="react-popper-dropdown__choices">
    { this.getFilteredValues().map((c, index: number) => this.renderChoice(c, index)) }
  </div>

  renderChoice = (c: T, index: number) => <div key={index} className={`react-popper-dropdown__choices__choice ${this.props.idGetter(c) === this.state.selected ? 'react-popper-dropdown__choices__choice--selected' : ''}`} onClick={(event: Object) => {this.props.onSelectChoice(c)}}>
    { this.props.renderer(this.props.labelGetter(c), c) }
  </div>

  getFilteredValues = () => this.props.choices.valueSeq().filter(v => this.props.labelGetter(v).toLowerCase().includes(this.props.filter.toLowerCase()))

  onKeyPress = (e: Object) => {
    if (e.key === 'Enter') {
      if (this.state.selected != null) {
        let value = this.props.choices.get(this.state.selected)
        this.props.onSelectChoice(value)
      }
    }
  }

  onKeyDown = (e: Object) => {
    if (e.key === 'ArrowDown') {
      this.selectNext()
    }
    else if (e.key === 'ArrowUp') {
      this.selectPrevious() 
    }
  }

  selectNext = () => {
    let values = this.getFilteredValues().toList()
    let selectedElementIndex = this.getSelectedElementIndex(values)

    let newElementIndex = selectedElementIndex + 1

    if (values.size >= newElementIndex)
      this.selectElementByIndex(values, newElementIndex)
  }

  selectPrevious = () => {
    let values = this.getFilteredValues().toList()
    let selectedElementIndex = this.getSelectedElementIndex(values)

    let newElementIndex = selectedElementIndex - 1

    if (newElementIndex >= 0)
      this.selectElementByIndex(values, newElementIndex)
  }

  selectElementByIndex = (values: List<T>, index: number) => {
    let id = values.get(index).id
    this.setState({
      selected: id
    })
  }

  getSelectedElementIndex = (values: List<T>) => this.state.selected == null ? -1 : values.findIndex(v => this.props.idGetter(v) === this.state.selected)
}

const StyledReactPopperDropdown = styled(ReactPopperDropdown)`

.custom-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.custom-select--disabled {
  color: #999;
}
.custom-select__select {
  display: flex;
  width: 100%;
  border: solid 1px #666;
  padding: 2px 4px;
  cursor: pointer;
}
.custom-select__value {
  flex-grow: 1;
  flex-shrink: 1;
  white-space: nowrap;
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
}
.custom-select__select__reset-button {
  width: 12px;
  margin-right: 4px;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;
  position: relative;
  text-align: center;
}
.custom-select__dropdown {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: solid 1px #ccc;
}
.custom-select__filter {
  flex-grow: 1;
  padding: 2px 4px;
}
.custom-select__filter input {
  width: 100%;
}
.custom-select__choices {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
}
.custom-select__choices__choice {
  padding: 2px 4px;
  cursor: pointer;
}
.custom-select__choices__choice:hover {
  background-color: #eee;
}
.custom-select__choices__choice--selected {
  background-color: #00ffff24;
}

.custom-select__select__open-button, .custom-select__select__close-button {
  width: 10px;
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
  text-align: center;
}
.custom-select__select__open-button::after, .custom-select__select__close-button::after {
  position: absolute;
  content: "";
  top: 50%;
	width: 0;
	height: 0;
	border-left: 4px solid transparent;
	border-right: 4px solid transparent;
  margin-top: -3px;
}
.custom-select__select__open-button::after {
	border-top: 7px solid #666;
}
.custom-select__select__close-button::after {
	border-bottom: 7px solid #666;
}
.custom-select__select__open-button:hover::after {
  border-top-color: #0ff; 
}
.custom-select__select__close-button:hover::after {
  border-bottom-color: #0ff; 
}
.custom-select--disabled .custom-select__select__open-button::after {
  border-top-color: #ccc;
}
.custom-select--disabled .custom-select__select__close-button::after {
  border-bottom-color: #ccc;
}
.custom-select--disabled .custom-select__select__reset-button::after {
  color: #ccc;
}
.custom-select__select__reset-button::after {
  position: absolute;
  content: "\00d7";
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -6px;
  font-size: 1.5em;
}
.custom-select__select__reset-button:hover::after {
  color: #0ff;
}
`

export default StyledReactPopperDropdown