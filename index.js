/**
 * 订阅-发布 模式的简单 JS 实现，相比其他实现，增加了事件缓存，对于单次事件，可以有效防止订阅晚于发布从而导致订阅不被执行
 *
 * @file 'event/index.js'
 * @desc 事件管理
 *
 */

/***
 * @function eventWatcher - 事件总线的初始化函数
 * @returns {{one: one, clearBuffer: clearBuffer, emit: emit, off: off, on: (function(String, Function, (Boolean|*)=): *)}}
 *
 * TODO 提取所有子方法，以减少对内存的消耗
 */
const eventWatcher = () => {
    /**
     * eventSet - 注册事件的回调合集
     * @type {Object}
     */
    const eventSet = {
        authorize: []
    };
    
    /**
     * mountedEventSet - 可卸载的事件回调合集
     * @type {Object}
     */
    let mountedEventSet = null;

    /**
     * @const eventBuf - 对于监听前就可能发生的事件，缓存事件，设置监听时即触发回调
     * @type {Object}
     */
    const eventBuf = {};

    /**
     * @function emit - 发送全局事件
     *
     * @param {String} type - 事件类型
     * @param {Object} event - 事件对象
     * @param {Boolean} [buffer = false] 是否缓存事件值
     *
     */
    const emit = (type, event, buffer = false) => {
        const eventCopy = JSON.parse(JSON.stringify(event));

        Object.freeze(eventCopy);

        buffer && (eventBuf[type] = eventCopy);
        
        // 在此调用事件预处理扩增事件类型，并触发对应回调

        if (eventSet[type]) {
            eventSet[type].forEach(item => {
                item(eventCopy);
            });
        }
        
        // 向集体挂载的回调函数集推送事件
        if(mountedEventSet && mountedEventSet[type]){
            mountedEventSet[type].forEach(item => {
                item(eventCopy);
            });
        }
    };
    
    /**
     * mount - 挂载回调列表
     * @param {Object} eventSetToMount
     * @param {Array} eventSetToMount[]
     */
    const mount = eventSetToMount => {
        mountedEventSet = eventSetToMount;
    }
    
    /**
     * unmount - 卸载事件
     * @return mountedEventSet - 考虑到卸载方可能需要缓存，将回调函数集返回
     * @desc 实际上这是为了可视化编辑器架构而留的钩子
     */
    const unmount = () => {
        const temp = mountedEventSet;
        mountedEventSet = null;
        return mountedEventSet
    }
    
    /**
     * preProcessor - 事件预处理器
     * @param {String} type
     * @param {Object} event
     */
    const preProcessor = (type, event) => {
        
    }
    
    /**
     *TODO preProcessorSet - 事件预处理器合集
     */
    const preProcessorSet = {};

    /**
     * @function on - 注册全局事件
     *
     * @param {String} type - 事件类型
     * @param {Function} callback - 事件回调函数
     * @param {Boolean|*} [useBuffer = false] - 事件
     *
     * @throws 对 callback 函数的类型检查
     *
     * @returns {Number} 事件句柄，用于取消事件监听
     */
    const on = (type, callback, useBuffer = false) => {
        if (!eventSet[type]) {
            eventSet[type] = [];
        }

        if (!callback instanceof Function) {
            throw new Error('callback must be a Function!');
        }

        useBuffer && eventBuf[type] && callback(eventBuf[type]);

        eventSet[type].push(callback);

        return eventSet[type].length
    };

    /**
     * @function off - 取消对某事件的监听
     *
     * @param {String} type - 事件类型
     * @param {Number} id - 需要取消的事件ID，即 registEvent 所返回的值
     *
     * @returns {Null}
     */
    const off = (type, id) => {
        if (!eventSet[type]) return null

        if (eventSet[type][id - 1]) {
            eventSet[type][id - 1] = false
        }

        if (!eventSet[type].reduce((pre, cur) => cur || pre, false)) {
            eventSet[type] = []
        }
    };

    /**
     * @const one - 只订阅一次的事件
     *
     * @param {String} type - 订阅的事件类型
     * @param {Function} callback - 事件回调
     * @param {Boolean} [useBuffer = false] - 是否使用缓存的事件
     */
    const one = (type, callback, [useBuffer = false]) => {
        const handler = on(type, e => {
            callback(e);
            off(type, handler);
        }, useBuffer);
    };

    /**
     * @const clearBuffer - 清空指定类型的事件缓存
     *
     * @param {String} type - 事件类型
     */
    const clearBuffer = type => {
        delete eventBuf[type];
    };

    return { emit, on, off, one, clearBuffer, mount, unmount }
};

// 初始化一个全局事件总线，以向后兼容
const globalEventWatcher = eventWatcher();

export {...globalEventWatcher, eventWatcher};
