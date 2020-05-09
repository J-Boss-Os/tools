import { Queue } from '../../src/main'

test('Queue 事件队列操作', (done) => {
  let queue = new Queue({ repeatEvent: true })
  let sum = 0

  function event1(resolve, reject) {
    setTimeout(() => {
      sum += 10
      resolve()
      done()
    }, 3000)
  }
  function event2(resolve, reject) {
    expect(sum).toBe(10)
    setTimeout(() => {
      sum += 2
      resolve()
      done()
    }, 1500)
  }
  queue
    .addEvent(event1)
    .addEvent(event2)
    .catch((err) => {
      console.log('执行错误', err)
      expect(err).toEqual(false)
      done()
    })
    .then(() => {
      console.log('执行完成', sum)
      expect(sum).toEqual(12)
      expect(sum).toEqual(14)
      done()
    })
    .exec()

  queue
    .addEvent((resolve, reject) => {
      reject('错误')
    })
    .catch((err) => {
      expect(err).toBe('错误')
    })
    .exec()
})

test('Queue 错误情况覆盖测试', () => {
  let queue = new Queue()
  let NOT_FUNCTION_FN = (e) => {
    expect(e).toEqual(Queue.ERROR_MESSAGE.NOT_FUNCTION)
  }
  let NOT_QUEUE_LENGTH_FN = (e) => {
    expect(e).toEqual(Queue.ERROR_MESSAGE.NOT_QUEUE_LENGTH)
  }
  queue._trigger('123')
  queue.catch(NOT_QUEUE_LENGTH_FN).exec()
  queue.addEvent(11).catch(NOT_FUNCTION_FN)
  queue.removeEvent(11).catch(NOT_FUNCTION_FN)
  queue.catch(1)
  queue.then(1).catch(NOT_FUNCTION_FN)
  let error = '错误'
  queue
    .addEvent((resolve, reject) => {
      reject(error)
    })
    .catch((e) => {
      expect(e).toBe(error)
    })
})
