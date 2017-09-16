import React, { Component } from 'react'
import PropTypes from 'prop-types'

import leftArrow from '../assets/arrow-l.png'
import rightArrow from '../assets/arrow-r.png'

import { getDateList, convertDyadicArray } from 'utils'

export default class Calendar extends Component {
  static propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    date: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    today: PropTypes.string.isRequired,
    dateList: PropTypes.array.isRequired,
    list: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired,
    selectDate: PropTypes.func.isRequired,
    selectYear: PropTypes.func.isRequired,
    selectMonth: PropTypes.func.isRequired,
    fetchPosts: PropTypes.func.isRequired,
  }

  static defaultProps = {
    startDate: '0', // '0' < '2013-08-01'
    endDate: '9', // '09' > '2021-02-01'
  }

  handlerIncreaseMonth = (e) => {
    // 当月 new Date(this.props.year, this.props.month -1)
    const { year, month, selectYear, selectMonth } = this.props
    const nextMonth = new Date(year, month)
    const _year = nextMonth.getFullYear()
    const _month = nextMonth.getMonth() + 1
    const el = e.target

    if (el.className.indexOf('icon-disable') === -1) {
      selectYear(_year)
      selectMonth(_month)
    }
  }

  handlerReduceMonth = (e) => {
    const { year, month, selectYear, selectMonth } = this.props
    const lastMonth = new Date(year, month - 2)
    const _year = lastMonth.getFullYear()
    const _month = lastMonth.getMonth() + 1
    const el = e.target

    if (el.className.indexOf('icon-disable') === -1) {
      selectYear(_year)
      selectMonth(_month)
    }
  }

  handlerSelectDate = (e) => {
    const el = e.target
    const { selectDate, selectYear, selectMonth, fetchPosts } = this.props
    if (el.nodeName === 'SPAN' && el.className.indexOf('item-disable') === -1) {
      const _date = el.getAttribute('data-date')
      const _month = +_date.slice(5, 7)
      const _year = +_date.slice(0, 4)
      selectDate(_date)
      selectYear(_year)
      selectMonth(_month)
      fetchPosts()
    }
  }

  getClassName = (r, c) => {
    const { year, month, today, dateList, date } = this.props
    let className
    const strYM = month < 10 ? `${year}-0${month}` : `${year}-${month}`
    const i = r * 7 + c
    const { startDate, endDate } = this.props
    const current = dateList[i]
    if (dateList[i].indexOf(strYM, 0) === -1) {
      className = dateList[i] === today
        ? 'item-light item-today' : 'item-light'
    } else {
      if (dateList[i] === date) {
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
    return startMonth === this.props.month
      ? 'icon-left icon-disable' : 'icon-left'
  }

  getRightIconClass = () => {
    let endMonth = 0
    if (this.props.endDate !== '9') {
      endMonth = +this.props.endDate.slice(5, 7)
    }
    return endMonth === this.props.month
      ? 'icon-right icon-disable' : 'icon-right'
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
          {`${this.props.year}年${this.props.month}月`}
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
            {this.props.list.map((arr, r) => {
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
