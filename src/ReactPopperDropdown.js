// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import {List, OrderedMap} from 'immutable'
import {Manager, Popper, Reference} from 'react-popper'
import ReactPopperPopup from './ReactPopperPopup'

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
  popperContainer: HTMLElement,
  className: string,
  autoWidth: boolean
};

type ReactPopperDropdownStateType<T, ID> = {
  choices: OrderedMap<ID, T>,
  open: boolean,
  filter: string
};

export default class ReactPopperDropdown<T, ID> extends React.PureComponent<ReactPopperDropdownPropsType<T, ID>, ReactPopperDropdownStateType<T, ID>> {

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
    popperContainer: document.body,
    className: '',
    autoWidth: false
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
    if (this.ref != null) {
      if(this.props.autoWidth)
        this.width = 'auto'
      else
        this.width = this.ref.getBoundingClientRect().width
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
                       if (this.props.enabled) this.toggleDropdown()
                     }}>
                  {this.renderValue()}
                  {this.props.enableReset && this.renderResetButton()}
                  {this.state.open
                    ? <div className="react-popper-dropdown__select__close-button"></div>
                    : <div className="react-popper-dropdown__select__open-button"></div>
                  }
                </div>
              )}
            </Reference>
            {this.state.open && element != null && ReactDOM.createPortal(
              <Popper placement={'bottom-start'}>
                {({placement, ref, style}) => {

                  let styleWithWidth = {
                    ...style,
                    width: this.width + 'px'
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

  renderDropDown = () => <ReactPopperPopup
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
    if(!event.target.className.includes('react-popper-dropdown__select__reset-button'))
      event.stopPropagation();
  }

  resetValue = (event: Object) => {
    event.stopPropagation()
    this.triggerOnChange(null)
  }

  renderResetButton = () => <div onClick={this.resetValue} className={'react-popper-dropdown__select__reset-button'}>

  </div>

  renderValue = () => <div className="react-popper-dropdown__value">
    { this.props.value == null
      ? this.renderEmptyValue()
      : this.props.renderer(this.getChoice() == null ? "" : this.props.labelGetter(this.getChoice()), this.getChoice())
    }
  </div>

  getChoice = () => this.state.choices.get(this.props.value)

  renderEmptyValue = () => <span>{ String.fromCharCode(160) }</span>

  getDropDownClass = () =>` react-popper-dropdown ${!this.props.enabled ? 'react-popper-dropdown--disabled' : ''} ${this.state.open ? 'react-popper-dropdown--open' : ''}`;
}