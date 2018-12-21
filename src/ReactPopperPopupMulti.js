// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import {List, OrderedMap} from 'immutable/dist/immutable'

type ReactPopperPopupPropsType<T, ID> = {
  filter: string,
  filterable: boolean,
  onFilterChange: string => void,
  choices: OrderedMap<ID, T>,
  value: List<ID>,
  idGetter: T => ID,
  labelGetter: T => string,
  renderer: (string, T) => React.Node,
  onSelectChoice: (c: T) => void,
  onClose: () => void,
  maxHeight: ?number
}

type ReactPopperPopupStateType<ID> = {
}

export default class ReactPopperPopupMulti<T, ID> extends React.PureComponent<ReactPopperPopupPropsType<T, ID>, ReactPopperPopupStateType<ID>> {

  filterInput: ?HTMLInputElement



  constructor(props: ReactPopperPopupPropsType<T, ID>) {
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {
    if (this.filterInput != null)
      this.filterInput.focus()
    document.addEventListener('click', this.handleClickOutside, false)
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleClickOutside = (event: Object) => {
    let ref = ReactDOM.findDOMNode(this) //eslint-disable-line
    if (ref != null && ! ref.contains(event.target))
      this.props.onClose()
  }

  render = () => <div className='react-popper-popup__dropdown react-popper-popup__dropdown--multi' style={{ maxHeight: this.props.maxHeight != null ? this.props.maxHeight: 'auto' }}>
    { this.props.filterable && this.renderFilter() }
    { this.renderChoices() }
  </div>

  renderFilter = () => <div className='react-popper-popup__filter'>
    <input ref={ref => { this.filterInput = ref }} type='text' value={this.props.filter} onChange={(event: Object) => this.props.onFilterChange(event.target.value)} />
  </div>

  renderChoices = () => <div className='react-popper-popup__choices'>
    { this.getFilteredValues().map((c, index: number) => this.renderChoice(c, index)) }
  </div>

  renderChoice = (c: T, index: number) => <div key={index} className={`react-popper-popup__choices__choice ${this.props.value.contains(this.props.idGetter(c)) ? 'react-popper-popup__choices__choice--selected' : ''}`} onClick={() => this.selectChoice(this.props.idGetter(c))}>
    { this.props.renderer(this.props.labelGetter(c), c) }
  </div>

  selectChoice = (id: ID) => {

    const {value, onSelectChoice} = this.props

    const isValueSelected = value.contains(id)
    const newValue = isValueSelected ? value.filter(v => v !== id) : value.push(id)
    
    onSelectChoice(newValue)
  }

  getFilteredValues = () => this.props.choices.valueSeq().filter(v => this.props.labelGetter(v).toLowerCase().includes(this.props.filter.toLowerCase()))
}
