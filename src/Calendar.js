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
    locale: PropTypes.string,
  }

  static defaultProps = {
    onSelect() {},
    minDate: '0', // '0' < '2013-08-01'
    maxDate: '9', // '09' > '2021-02-01'
    locale: 'en'
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
      activeDate,
      today,
      list,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.year === nextState.year &&
      this.state.month === nextState.month &&
      this.state.activeDate === nextState.activeDate
    )
  }

  handleIncreaseMonth = () => {
    // 当月 new Date(this.state.year, this.state.month -1)
    const nextMonth = new Date(this.state.year, this.state.month)
    const year = nextMonth.getFullYear()
    const month = nextMonth.getMonth() + 1
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)

    this.setState({ year, month, list })
  }

  handleReduceMonth = () => {
    const lastMonth = new Date(this.state.year, this.state.month - 2)
    const year = lastMonth.getFullYear()
    const month = lastMonth.getMonth() + 1
    const dateList = getDateList(year, month)
    const list = convertDyadicArray(dateList, 6)

    this.setState({ year, month, list })
  }

  handleSelectDate = (e) => {
    const el = e.target
    if (el.nodeName === 'SPAN' && el.className.indexOf('item-disable') === -1) {
      const activeDate = el.getAttribute('data-date')
      this.props.onSelect(activeDate)
      const month = +activeDate.slice(5, 7)
      const year = +activeDate.slice(0, 4)

      if (this.state.activeDate !== activeDate) {
        if (this.state.month !== month) {
          const dateList = getDateList(year, month)
          const list = convertDyadicArray(dateList, 6)
          this.setState({ year, month, activeDate, list })
        } else {
          this.setState({ activeDate })
        }
      }
    }
  }

  getClassName(dateItem) {
    const { year, month, today, activeDate } = this.state
    let className
    const strYM = month < 10 ? `${year}-0${month}` : `${year}-${month}`
    const { minDate, maxDate } = this.props
    if (dateItem.indexOf(strYM, 0) === -1) {
      className = dateItem === today
        ? 'item-light item-today' : 'item-light'
    } else {
      if (dateItem === activeDate) {
        className = dateItem === today
          ? 'item-active item-today' : 'item-active'
      } else {
        className = dateItem === today
          ? 'item-today' : null
      }
    }

    if ((minDate > dateItem) || (maxDate < dateItem)) {
      className = dateItem === today ? 'item-disable item-today' : 'item-disable'
    }

    return className
  }

  renderHeader() {
    const { year, month } = this.state
    const { locale } = this.props
    const monthEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
      <div className="calendar-header">
        <img
          className="icon-left"
          src={leftArrow}
          onClick={this.handleReduceMonth}
        />
        {
          locale === 'zh' ? `${year}年 ${month}月`
            : `${monthEn[month - 1]} ${year}`
        }
        <img
          className="icon-right"
          src={rightArrow}
          onClick={this.handleIncreaseMonth}
        />
      </div>
    )
  }

  renderTable() {
    const weekdays = this.props.locale === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['日', '一', '二', '三', '四', '五', '六']
    return (
      <table className="calendar-table">
        <tbody onClick={this.handleSelectDate}>
          <tr>
            {
              weekdays.map((w, i) => <th key={w} >{w}</th>)
            }
          </tr>
          {this.state.list.map(arr => {
            return (
              <tr key={arr[0]}>
                {arr.map(value =>
                  (<td key={value}>
                    <span
                      data-date={value}
                      className={this.getClassName(value)}
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
    )
  }

  render() {
    return (
      <div style={{ width: '277px', height: '355px', fontSize: '14px' }}>
        {this.renderHeader()}
        {this.renderTable()}
      </div>
    )
  }
}
