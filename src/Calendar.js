import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { convertDyadicArray, getDateList, dateFormat } from 'utils'
import leftArrow from '../assets/arrow-l.png'
import rightArrow from '../assets/arrow-r.png'

export default class Calendar extends Component {
  static propTypes = {
    selectCallback: PropTypes.func,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }

  static defaultProps = {
    selectCallback() {},
    startDate: '0', // '0' < '2013-08-01'
    endDate: '9', // '09' > '2021-02-01'
  }

  constructor(props) {
    super(props)
    const now = new Date()
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    const endDate = this.props.endDate !== '9'
      ? this.props.endDate : dateFormat(yesterday)
    const year = +endDate.slice(0, 4)
    const month = +endDate.slice(5, 7)
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)
    const activeDate = endDate
    const today = dateFormat(now)

    this.state = {
      year,
      month,
      dateList,
      activeDate,
      today,
      list,
    }
  }

  handlerIncreaseMonth = (e) => {
    // 当月 new Date(this.state.year, this.state.month -1)
    const nextMonth = new Date(this.state.year, this.state.month)
    const year = nextMonth.getFullYear()
    const month = nextMonth.getMonth() + 1
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)
    const el = e.target

    if (el.className.indexOf('icon-disable') === -1) {
      this.setState(prevState => ({ year, month, dateList, list }))
    }
  }

  handlerReduceMonth = (e) => {
    const lastMonth = new Date(this.state.year, this.state.month - 2)
    const year = lastMonth.getFullYear()
    const month = lastMonth.getMonth() + 1
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)
    const el = e.target

    if (el.className.indexOf('icon-disable') === -1) {
      this.setState(prevState => ({ year, month, dateList, list }))
    }
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
    const { startDate, endDate } = this.props
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

    if ((startDate > current) || (endDate < current)) {
      className = dateList[i] === today ? 'item-disable item-today' : 'item-disable'
    }

    return className
  }

  getLeftIconClass = () => {
    let startMonth = 0
    if (this.props.startDate !== '0') {
      startMonth = +this.props.startDate.slice(5, 7)
    }
    return startMonth === this.state.month
      ? 'icon-left icon-disable' : 'icon-left'
  }

  getRightIconClass = () => {
    let endMonth = 0
    if (this.props.endDate !== '9') {
      endMonth = +this.props.endDate.slice(5, 7)
    }
    return endMonth === this.state.month
      ? 'icon-right icon-disable' : 'icon-right'
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.year === nextState.year &&
      this.state.month === nextState.month &&
      this.state.activeDate === nextState.activeDate
    )
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.activeDate !== this.state.activeDate &&
    this.props.selectCallback(this.state.activeDate)
  }

  render() {
    return (
      <div style={{ width: '275px', height: '362px', fontSize: '14px' }}>
        <div className="calendar-header">
          <img
            className={this.getLeftIconClass()}
            src={leftArrow}
            onClick={this.handlerReduceMonth}
          />
          {`${this.state.year}年${this.state.month}月`}
          <img
            className={this.getRightIconClass()}
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
