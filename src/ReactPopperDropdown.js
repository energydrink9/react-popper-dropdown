// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import {List, OrderedMap} from 'immutable'
import {Manager, Popper, Reference} from 'react-popper'
import ReactPopperPopup from './ReactPopperPopup'
import ReactPopperPopupMulti from './ReactPopperPopupMulti'

type ReactPopperDropdownPropsType<T, ID> = {
  choices: List<T>,
  value: ?ID | List<ID>,
  idGetter: T => ID,
  labelGetter: T => string,
  renderer: (string, T) => React.Node,
  onValueChange: (?T) => void,
  enabled: boolean,
  enableReset: boolean,
  filterable: boolean,
  popperContainer: HTMLElement,
  className: string,
  autoWidth: boolean,
  multi: boolean,
  maxHeight: ?number
}

type ReactPopperDropdownStateType<T, ID> = {
  choices: OrderedMap<ID, T>,
  open: boolean,
  filter: string
}

export default class ReactPopperDropdown<T, ID> extends React.PureComponent<ReactPopperDropdownPropsType<T, ID>, ReactPopperDropdownStateType<T, ID>> {

  ref: ?HTMLDivElement
  width: string = '0px'
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
    popperContainer: document.body,
    className: '',
    autoWidth: false,
    multi: false,
    maxHeight: null
  }

  constructor(props: ReactPopperDropdownPropsType<T, ID>) {
    super(props)
    this.state = {
      choices: OrderedMap(props.choices.map(c => [this.props.idGetter(c), c])),
      open: false,
      filter: ''
    }
  }

  getInitialState = (props: ReactPopperDropdownPropsType<T, ID>) => ({
    choices: OrderedMap(props.choices.map(c => [this.props.idGetter(c), c])),
      open: false,
      filter: ''
  })

  componentDidMount = () => {
    if (this.ref != null) {
      if(this.props.autoWidth)
        this.width = 'auto'
      else
        this.width = this.ref.getBoundingClientRect().width + 'px'
    }
  }

  componentDidUpdate = (prevProps: ReactPopperDropdownPropsType<T, ID>) => {
    if (this.props.choices !== prevProps.choices) {
      this.setState({
        choices: OrderedMap(this.props.choices.map(c => [this.props.idGetter(c), c])),
          open: false,
          filter: ''
      })
    }
  }

  render = () => {
    let element = this.props.popperContainer
    return (
      <div className={`${this.props.className}`}>
        <div
          className={this.getDropDownClass()}
          ref={ref => {
            this.ref = ref
          }}>
          <Manager>
            <Reference>
              {({ref}) => (
                <div ref={ref}
                     className={`react-popper-dropdown__select`}
                     onClick={() => {
                       if (this.props.enabled) {
                         this.toggleDropdown()
                       }
                     }}>
                  {this.renderSingleOrMultiValue()}
                  {this.state.open
                    ? <div className='react-popper-dropdown__select__close-button'></div>
                    : <div className='react-popper-dropdown__select__open-button'></div>
                  }
                </div>
              )}
            </Reference>
            {this.state.open && element != null && ReactDOM.createPortal(
              <Popper placement={'bottom-start'}>
                {({placement, ref, style}) => {

                  let styleWithWidth = {
                    ...style,
                    width: this.width
                  }

                  return (
                    <div ref={ref}
                         style={styleWithWidth}
                         data-placement={placement}
                         className={`${this.props.className} react-popper-dropdown__popper`}>
                      <div className={`react-popper-dropdown__popup`}>
                        {this.renderDropDown()}
                      </div>
                    </div>
                  )
                }}
              </Popper>,
              element
            )
            }
          </Manager>
        </div>
      </div>
    )}

  renderDropDown = () => {

    const { filterable, multi, value, idGetter, labelGetter, renderer, maxHeight } = this.props
    const { filter, choices } = this.state

    return multi ? <ReactPopperPopupMulti
      filterable={filterable}
      filter={filter}
      onFilterChange={this.onFilterChange}
      choices={choices}
      value={multi ? value : value == null ? List() : List(value) }
      idGetter={idGetter}
      labelGetter={labelGetter}
      renderer={renderer}
      onSelectChoice={this.onSelectChoice}
      maxHeight={maxHeight}
      onClose={() => { this.closeSelect() }}
    /> : <ReactPopperPopup
      filterable={filterable}
      filter={filter}
      onFilterChange={this.onFilterChange}
      choices={choices}
      value={multi ? value : value == null ? List() : List(value) }
      idGetter={idGetter}
      labelGetter={labelGetter}
      renderer={renderer}
      maxHeight={maxHeight}
      onSelectChoice={this.onSelectChoice}
      onClose={() => { this.closeSelect() }}
    />
  }

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

  resetValue = (event: Object, id: ID) => {
    event.stopPropagation()
    if (this.props.multi) {
      this.triggerOnChange(this.props.value.filter(v => v !== id))
    }
    else
      this.triggerOnChange(null)
  }

  renderResetButton = (id: ID) => id != null && <div style={{display: 'inline-block', verticalAlign: 'middle'}} onClick={(e) => this.resetValue(e, id)} className={'react-popper-dropdown__select__reset-button'} />

  renderSingleOrMultiValue = () => <div className='react-popper-dropdown__value'>
    { this.props.multi ? this.renderMultiValue(this.props.value) : this.renderSingleValue(this.props.value) }
  </div>

  renderMultiValue = (value: List<ID>) => value.isEmpty()
  ? this.renderEmptyValue()
  : value.map((v, index) => <span key={index}>
    { this.renderValue(v) }
    {this.renderResetButton(v)}
  </span>)

  renderSingleValue = (value: ?ID) => value == null
    ? this.renderEmptyValue()
    : <span>
      { this.renderValue(value) }
      { this.props.enableReset && this.renderResetButton(value) }
    </span>

  renderValue = (id: ID) => this.props.renderer(this.getChoice(id) == null ? '' : this.props.labelGetter(this.getChoice(id)), this.getChoice(id))

  getChoice = (id: ID) => this.state.choices.get(id)

  renderEmptyValue = () => <span>{ String.fromCharCode(160) }</span>

  getDropDownClass = () =>` react-popper-dropdown ${!this.props.enabled ? 'react-popper-dropdown--disabled' : ''} ${this.state.open ? 'react-popper-dropdown--open' : ''}`;
}