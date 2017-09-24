import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { convertDyadicArray, getDateList, dateFormat } from './utils'
import leftArrow from './assets/arrow-l.png'
import rightArrow from './assets/arrow-r.png'
import './assets/calendar.scss'

export default class Calendar extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
  }

  static defaultProps = {
    onSelect() {},
    minDate: '0', // '0' < '2013-08-01'
    maxDate: '9', // '09' > '2021-02-01'
  }

  constructor(props) {
    super(props)
    const now = new Date()
    const today = dateFormat(now)
    const year = +today.slice(0, 4)
    const month = +today.slice(5, 7)
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)
    const activeDate = today

    this.state = {
      year,
      month,
      dateList,
      activeDate,
      today,
      list,
    }
  }

  handlerIncreaseMonth = () => {
    // 当月 new Date(this.state.year, this.state.month -1)
    const nextMonth = new Date(this.state.year, this.state.month)
    const year = nextMonth.getFullYear()
    const month = nextMonth.getMonth() + 1
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)

    this.setState(prevState => ({ year, month, dateList, list }))
  }

  handlerReduceMonth = () => {
    const lastMonth = new Date(this.state.year, this.state.month - 2)
    const year = lastMonth.getFullYear()
    const month = lastMonth.getMonth() + 1
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)

    this.setState(prevState => ({ year, month, dateList, list }))
  }

  handlerSelectDate = (e) => {
    const el = e.target
    if (el.nodeName === 'SPAN' && el.className.indexOf('item-disable') === -1) {
      const activeDate = el.getAttribute('data-date')
      const month = +activeDate.slice(5, 7)
      const year = +activeDate.slice(0, 4)

      if (this.state.activeDate !== activeDate) {
        if (this.state.month !== month) {
          const dateList = getDateList(year, month)
          const list = convertDyadicArray(dateList, 6)
          this.setState(prevState => ({ year, month, dateList, activeDate, list }))
        } else {
          this.setState((prevState) => ({ activeDate }))
        }
      }
    }
  }

  getClassName = (r, c) => {
    const { year, month, today, dateList, activeDate } = this.state
    let className
    const strYM = month < 10 ? `${year}-0${month}` : `${year}-${month}`
    const i = r * 7 + c
    const { minDate, maxDate } = this.props
    const current = dateList[i]
    if (dateList[i].indexOf(strYM, 0) === -1) {
      className = dateList[i] === today
        ? 'item-light item-today' : 'item-light'
    } else {
      if (dateList[i] === activeDate) {
        className = dateList[i] === today
          ? 'item-active item-today' : 'item-active'
      } else {
        className = dateList[i] === today
          ? 'item-today' : null
      }
    }

    if ((minDate > current) || (maxDate < current)) {
      className = dateList[i] === today ? 'item-disable item-today' : 'item-disable'
    }

    return className
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.year === nextState.year &&
      this.state.month === nextState.month &&
      this.state.activeDate === nextState.activeDate
    )
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.activeDate !== this.state.activeDate &&
    this.props.onSelect(this.state.activeDate)
  }

  render() {
    return (
      <div style={{ width: '275px', height: '362px', fontSize: '14px' }}>
        <div className="calendar-header">
          <img
            className="icon-left"
            src={leftArrow}
            onClick={this.handlerReduceMonth}
          />
          {`${this.state.year}年${this.state.month}月`}
          <img
            className="icon-right"
            src={rightArrow}
            onClick={this.handlerIncreaseMonth}
          />
        </div>
        <table className="calendar-table">
          <tbody onClick={this.handlerSelectDate}>
            <tr>
              <th>日</th>
              <th>一</th>
              <th>二</th>
              <th>三</th>
              <th>四</th>
              <th>五</th>
              <th>六</th>
            </tr>
            {this.state.list.map((arr, r) => {
              return (<tr key={`row-${r}`}>
                {arr.map((value, c) =>
                  (<td key={`col-${c}`}>
                    <span
                      data-date={value}
                      className={this.getClassName(r, c)}
                    >
                      {value.slice(8)}
                    </span>
                  </td>)
                )}
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
