# event-watcher
“发布-订阅”事件机制的 JavaScript 实现，相比其他实现，开发者可以缓存事件，以避免事件在订阅之前就发生而导致的尴尬。

### 使用

#### eventWatcher
初始化一个局部的 eventWatcher。
参数 | 类型 | 必选 | 默认值 | 描述
:-: | :-: | :-: | :-: | :-:
\-|\-|\-|\-|\-

##### 返回: Object，一个局部的 eventWatcher。

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

#### clearBuffer
清除指定的缓存事件

##### 参数列表
参数 | 类型 | 必选 | 默认值 | 描述
:-: | :-: | :-: | :-: | :-
type | String | True | \- | 需要清除的事件类型

无返回值

##### 示例
```javascript
clearBuffer('click');
```

#### mount
批量监听事件回调合集，注意同一时间内只能有一个挂载，后发的挂载会将现有的挂载替换，可能导致其内存被回收

##### 参数列表
参数 | 类型 | 必选 | 默认值 | 描述
:-: | :-: | :-: | :-: | :-
eventSet | Object | True | \- | 事件回调键值对
eventSet[type] | Array | False | \- | 某类型事件的回调合集
eventSet[type][] | Function | False | \- | 事件回调函数

##### 无返回值

##### 示例
```javascript
mount({
   click: [
      console.log,
      console.warn
   ],
   mousemove: [
      console.error,
      () => console.log('mousemoving')
   ]
})
```

#### unmount 
解除批量挂载的事件。

##### 无参数

##### 返回被卸载的事件回调集

##### 示例
```javascript
console.log(unmount());
/*
打印如下内容：
{
   click: [
      console.log,
      console.warn
   ],
   mousemove: [
      console.error,
      () => console.log('mousemoving')
   ]
}

*/
```

TODO: 
1. Safe mode ，如果某一个回调抛错的话，势必会导致后面的所有订阅都失去效力。 


