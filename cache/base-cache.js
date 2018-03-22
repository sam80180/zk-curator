/**
 * Created by yanshaowen on 2018/02/26
 * 基础的cache
 */
'use strict';
const {switchCallback} = require('./cache-util');

class BaseCache {
    constructor(client, path) {
        if (typeof path !== 'string' || path.length === 0 || path[0] !== '/') {
            throw new Error('path error');
        }
        if (!client) {
            throw new Error('client error');
        }
        this._client = client;
        this._path = path;
        const split = path.split('/');
        let id = 'root';
        if (split.length >= 2) {
            id = split[split.length - 1]
        }
        this._data = {root: {path: path, id: id}};
        this._callbacks = null;
    }

    get client() {
        return this._client;
    }

    set client(value) {
        this._client = value;
    }

    get path() {
        return this._path;
    }

    set path(value) {
        this._path = value;
    }


    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }


    get callbacks() {
        return this._callbacks;
    }

    set callbacks(value) {
        this._callbacks = value;
    }

    getData() {
        return this.data.root;
    }

    /**
     *
     * @param callbacks
     */
    addListener(callbacks) {
        this.callbacks = switchCallback(callbacks);
    }

    /**
     * 深拷贝一级的子节点
     * @param o 对应的父节点的childrenData
     */
    static deepCopyChild(o) {
        const cs = {};
        for (const n in o) {
            const c = o[n]
            cs[n] = {
                id: c.id,
                path: c.path,
                state: JSON.parse(JSON.stringify(c.state)),
                data: c.data,
                childrenData: {},
                children: [],
            }
        }
        return cs;
    }

    /**
     * 深拷贝节点
     * @param c 对应的节点
     */
    static deepCopyNode(c) {
        return {
            id: c.id,
            path: c.path,
            state: JSON.parse(JSON.stringify(c.state)),
            data: c.data,
            childrenData: {},
            children: [],
        };
    }

    /**
     * 对比nodes1和nodes2的不同 并返回不同的node数组
     * @param nodes1
     * @param nodes2
     */
    static findDiffNode(nodes1, nodes2) {
        const keys1 = new Set(Object.keys(nodes1));
        const keys2 = new Set(Object.keys(nodes2));
        const d1 = [...keys1].filter(x => !keys2.has(x));
        const d2 = [...keys2].filter(x => !keys1.has(x));
        const result = [];
        d1.forEach(k => result.push(nodes1[k]));
        d2.forEach(k => result.push(nodes2[k]));
        return result;

    }
}

module.exports = BaseCache;
