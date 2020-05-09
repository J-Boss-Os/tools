export class Queue {
  /**
   * 创建事件队列
   * @param {Object} param0 // 配置
   * @param {Boolean} param0.repeatEvent 是否重复注入事件
   * @param {Number} param0.maxEventQueue 允许多少事件排队 0 无限制
   */
  constructor({ repeatEvent = false, maxEventQueue = 0 } = {}) {
    this._eventQueue = maxEventQueue ? new Array(maxEventQueue) : []
    this._catchQueue = []
    this._thenQueue = []
    this._repeatEvent = repeatEvent
    this._maxEventQueue = maxEventQueue
  }
  /**
   * 添加事件到循环队列内
   * @param {Function} event // 待执行的事件
   * @returns {Queue} 返回This 本身
   */
  addEvent(event) {
    try {
      if (typeof event === 'function') {
        if (this._repeatEvent) {
          this.removeEvent(event)
        }
        this._eventQueue.push(event)
      } else throw Queue.ERROR_MESSAGE.NOT_FUNCTION
    } catch (e) {
      console.error(e)
    }
    return this
  }
  /**
   * 把事件从循环队列内移除
   * @param {Function} event // 移除的事件
   * @returns {Queue} 返回This 本身
   */
  removeEvent(event) {
    try {
      if (typeof event === 'function') {
        this._eventQueue = this._eventQueue.filter((item) => item !== event)
      } else throw Queue.ERROR_MESSAGE.NOT_FUNCTION
    } catch (e) {
      console.error(e)
    }
    return this
  }
  /**
   * 仅限 对象内部使用 ,外部请勿调用!!!!
   * @param {string} queueName 队列名称
   * @param  {...any} ags 执行传参
   */
  _trigger(queueName, ...ags) {
    if (Array.isArray(this[queueName])) {
      this[queueName].forEach((event) => event(...ags))
    } else
      console.warn(
        Queue.ERROR_MESSAGE.NOT_QUEUE_NAME.replace('$queueName', queueName)
      )
  }
  /**
   * 递归执行事件循环
   * @param {Number} index
   */
  _execEvenetQueue(index, opt) {
    if (index === this._eventQueue.length) {
      return this._trigger('_thenQueue')
    }
    /**
     * 事件成功继续执行回调
     * @param {Function} param0 成功回调 resolve
     * @param {Function} param1 失败回调 reject
     */
    this._eventQueue[index](
      () => {
        this._execEvenetQueue(index + 1, opt)
      },
      (...age) => {
        this._trigger('_catchQueue', ...age)
      }
    )
  }
  /**
   * 开始执行事件队列
   * @param { boolean } execedIsEmptyQueue 执行成功后是否清除事件队列
   */
  exec({ successIsEmptyQueue = true } = {}) {
    try {
      if (!this._eventQueue.length) {
        throw Queue.ERROR_MESSAGE.NOT_QUEUE_LENGTH
      }
      this._execEvenetQueue(0, { successIsEmptyQueue })
    } catch (e) {
      this._trigger('_catchQueue', e)
    }
    return this
  }
  /**
   * 事件循环执行期间如果报错,则运行 catch 内注册的错误监听事件
   * @param {Function} event // 错误监听事件
   */
  catch(event) {
    try {
      if (typeof event === 'function') {
        this._catchQueue.push(event)
      } else throw Queue.ERROR_MESSAGE.NOT_FUNCTION
    } catch (e) {
      console.error(e)
    }
    return this
  }
  /**
   * 事件循环执行完成后触发的 then 成功事件
   * @param {Function} event // 对象执行完成监听事件
   */
  then(event) {
    try {
      if (typeof event === 'function') {
        this._thenQueue.push(event)
      } else throw Queue.ERROR_MESSAGE.NOT_FUNCTION
    } catch (e) {
      console.error(e)
    }
    return this
  }
}

Queue.ERROR_MESSAGE = {
  NOT_FUNCTION: new Error('请传入一个函数'),
  NOT_QUEUE_NAME: `不存在 $queueName 事件循环队列`,
  NOT_QUEUE_LENGTH: new Error('事件队列内没有可执行的事件'),
}
