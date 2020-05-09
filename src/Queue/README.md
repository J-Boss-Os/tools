# Queue 事件队列

如果你需要同时监听多个任务有序执行完成后再做下一步处理的话,那么你就需要用到`Queue`库

## 快速使用

```js
import { Queue } from 'Jboss-tool'
let queue = new Queue()
queue
  .addEvent((res, rej) => {
    setTimeout(() => {
      cosnole.log('第一个事件')
      res()
    }, 3000)
  })
  .addEvent((res, rej) => {
    setTimeout(() => {
      cosnole.log('第二个事件')
      res()
    }, 3000)
  })
  .then(() => {
    console.log('前两个事件都执行成功')
  })
  .exec() // 开始执行
```

## Attr 构建属性

### repeatEvent

- 类型: Boolean
- 默认: false
- 描述: 是支持否注入重复事件

### maxEventQueue

- 类型: Number
- 默认: 0
- 描述: 队列支持的最大可注入事件数量; 0 无限大 > 1+ 为 1+ 个

## Event 事件

### addEvent

- 类型: Fucntion(resolve,reject)
- 链式操作: 支持
- 描述: 添加一个待执行的事件到队列里面,调用 resolve 继续下一个事件,调用 reject 停止事件循环 并 触发所有的 cath 事件

### removeEvenet

- 类型: Fucntion()
- 链式操作: 支持
- 描述: 删除队列中一个待执行的事件

### exec

- 类型: Fucntion()
- 链式操作: 支持
- 描述: 开始执行队列的事件循环
- 注意: 该事件应该放到最后只执行

### then

- 类型: Fucntion()
- 链式操作: 支持
- 描述: 事件队列全部成功执行后,会触发该函数注入的所有事件监听

### catch

- 类型: Fucntion()
- 链式操作: 支持
- 描述: 事件队列执行中有任何一个事件触发了 reject 函数后,就会触发该函数注入的所有事件监听
