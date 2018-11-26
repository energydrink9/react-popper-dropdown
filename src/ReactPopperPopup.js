// @flow

import * as React from "react";
import ReactDOM from "react-dom";
import {List, OrderedMap} from "immutable/dist/immutable";

type ReactPopperPopupPropsType<T, ID> = {
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

type ReactPopperPopupStateType<ID> = {
  selected: ?ID
};

export default class ReactPopperPopup<T, ID> extends React.PureComponent<ReactPopperPopupPropsType<T, ID>, ReactPopperPopupStateType<ID>> {

  filterInput: ?HTMLInputElement



  constructor(props: ReactPopperPopupPropsType<T, ID>) {
    super(props)
    this.state = {
      selected: this.props.value
    }
  }

  componentDidMount = () => {
    if (this.filterInput != null)
      this.filterInput.focus()
    document.addEventListener('click', this.handleClickOutside, false)

    if (this.state.selected == null)
      this.selectNext()
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleClickOutside = (event: Object) => {
    let ref = ReactDOM.findDOMNode(this) //eslint-disable-line
    if (ref != null && ! ref.contains(event.target))
      this.props.onClose()
  }

  render = () => <div className="react-popper-popup__dropdown">
    { this.props.filterable && this.renderFilter() }
    { this.renderChoices() }
  </div>

  renderFilter = () => <div className="react-popper-popup__filter">
    <input ref={ref => { this.filterInput = ref }} type="text" value={this.props.filter} onChange={(event: Object) => this.props.onFilterChange(event.target.value)} onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown} />
  </div>

  renderChoices = () => <div className="react-popper-popup__choices">
    { this.getFilteredValues().map((c, index: number) => this.renderChoice(c, index)) }
  </div>

  renderChoice = (c: T, index: number) => <div key={index} className={`react-popper-popup__choices__choice ${this.props.idGetter(c) === this.state.selected ? 'react-popper-popup__choices__choice--selected' : ''}`} onClick={(event: Object) => {this.props.onSelectChoice(c)}}>
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
