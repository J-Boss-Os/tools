export class EventListener {
  /**
   * 创建事件监听
   */
  constructor() {
    this._maxIndex = 0
    this._eventListener = {}
    this._isExpectValue = {
      EVENT_NAME(value) {
        if (typeof value !== 'string') {
          throw new Error('eventName 请传入字符串')
        }
      },
      EVENTS(value) {
        if (Array.isArray(value)) return 'array'
        if (typeof value === 'function') return 'function'
        throw new Error('传入的监听事件必须是 单个函数 或 函数数组集合')
      },
    }
  }
  /**
   * 删除对应的事件监听
   * @param {String} eventName 监听的事件名称
   * @param {Function | Array<Function> | undefined} events 要监听的事件 可以是单个函数，或是函数数组
   */
  removeEventListener(eventName, events) {
    try {
      this._isExpectValue['EVENT_NAME'](eventName)
      let eventsType = this._isExpectValue['EVENTS'](events)
      if (eventsType === 'array') {
      } else {
      }
    } catch (error) {
      this.catch(error)
    }
    return this
  }
  /**
   * 单个添加，内部调用
   * @param {String} eventName 监听的事件名称
   * @param {Function} event 要监听的事件 可以是单个函数，或是函数数组
   */
  _addEvent(eventName, event) {
    try {
      if (!this._eventListener[eventName]) {
        this._eventListener[eventName] = []
        this[eventName] = () => {}
      }
      if (!event._maxIndex) {
        event._maxIndex = this._maxIndex
        this._eventListener[eventName].push(event)
        this._maxIndex++
      }
    } catch (error) {
      this.catch(error)
    }
  }
  /**
   * 添加事件监听
   * @param {String} eventName 监听的事件名称
   * @param {Function | Array<Function>} events 要监听的事件 可以是单个函数，或是函数数组
   */
  addEventListener(eventName, events) {
    try {
      this._isExpectValue['EVENT_NAME'](eventName)
      let eventsType = this._isExpectValue['EVENTS'](events)
      // 是数组
      if (eventsType === 'array') {
        events.map((event) => this._addEvent(eventName, event))
      } else {
        this._addEvent(eventName, events)
      }
    } catch (error) {
      this.catch(error)
    }
    return this
  }

  /**
   * 错误监听
   * @param {*} error 错误信息
   */
  catch(error) {}

  /**
   * 成功监听
   */
  then() {}
}
