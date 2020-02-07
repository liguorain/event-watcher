# event-watcher
“发布-订阅”事件机制的 JavaScript 实现，相比其他实现，开发者可以缓存事件，以避免事件在订阅之前就发生而导致的尴尬。

### 使用
#### emit
向事件监听者发送事件(event)及事件类型(type)，这些信息会被分发给注册了同样类型的注册者。

参数 | 类型 | 必选 | 默认值 | 描述
:-: | :-: | :-: | :-: | :-:
type | String | True | \- | 事件类型
event | Object | True | \- | 事件内容
buffer | Boolean | False | false | 是否缓存，用于可能在事件发生后注册的订阅者

无返回值。
##### 示例
```javascript
emit('load', {type: 'load'});
```

#### <span id="on">on</span>
注册事件。

参数 | 类型 | 必选 | 默认值 | 描述
:-: | :-: | :-: | :-: | :-:
type | String | True | \- |
callback | Function | True | \- |
useBuffer | Boolean | False | false | 是否使用缓存的事件值

##### 返回：Number ，一个句柄，用于取消此订阅
```javascript
on('load', e => {
   const { type } = e;
   console.log(e); // 'load'
});
```

#### off
取消已注册的事件。

参数 | 类型 | 必选 | 默认值 | 描述
:-: | :-: | :-: | :-: | :-:
type | String | True | \- |
id | Number | True | \- |

无返回值。
```javascript
off('load', 0);
```

#### one
只订阅一次的事件。
参数与 [on](#on) 方法一致。
无返回值。
使用与 [on](#on) 方法一致。
