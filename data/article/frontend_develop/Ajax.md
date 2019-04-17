# Ajax Document

## Version
>1.0版本
- 基本的同源请求，无法使用跨域请求
- 支持大部分请求方法：GET,POST,PUT,DELETE
- 支持同步或异步请求
- 仅支持文本类型数据的传输，但可通过伪装数据mimeType来实现二进制数据的收发
- 无法监听上传和下载的进度
>2.0更新内容
- xhr.timeout 设置请求时限
- xhr.ontimeout 设置请求超时监听
- FormData对象 模拟Html的表单请求
- 文件上传支持 FormData内部可以添加文件对象，并添加到Post参数中
- CORS跨域请求 服务端和客户端配置好跨域Header后即可使用xhr发送跨域请求
- xhr.responseType 可以设置此属性为'blob'来接受二进制数据流
- xhr.onprogress/xhr.upload.onprogress 监听上传和下载的进度

## Basic
* 基本请求流程
```javascript
let xhr = new XMLHttpRequest();
// Async
xhr.onload = () => {
    if (xhr.status === 200) {
        console.log('Success: ', xhr.responseText)
    } else {
        console.error('Failed: ', xhr.status, xhr.statusText)
    }
};
// GET
xhr.open('GET', 'some.url.com?username=bill', true);
xhr.send();
// POST
xhr.open('POST', 'some.url.com', true);
xhr.send('username=bill');
// Sync, Do not set xhr.onload, directly get result after xhr.send()
if (xhr.status === 200) {
    console.log('Success: ', xhr.responseText)
} else {
    console.error('Failed: ', xhr.status, xhr.statusText)
}
```

* `xhr.send()` 可发送数据类型
    * ArrayBuffer 数组对象
    * Blob 二进制对象
    * Docucment对象
    * DOMString对象
    * FormData对象
    * null空对象

* `xhr.responseType` 可接收数据类型

    * '' 默认值，纯文本格式
    * 'text' 纯文本格式
    * 'arraybuffer' 数组形式
    * 'blob' 二进制形式（文件）
    * 'document' xml文档形式
    * 'json' 解析为，javascript对象

* 设置Header
```javascript
xhr.open()
...
// open()之后send()之前
xhr.setRequestHeader(name, value)
...
xhr.send()
```

## State & Event
* `xhr.readyState`的状态
    * 0  初始值，未进行任何操作
    * 1  xhr.open()方法调用后立即触发
    * 2  上传完成,即xhr.send()方法调用后并且已经上传成功
    * 3  正在下载
    * 4  请求完成 

* 事件

|顺序|事件|调用时机|
|:---:|:---|:---|
|1|`xhr.onloadstart`|`xhr.send()`之后立即触发|
|2|`xhr.upload.onloadstart`|`xhr.upload.onloadstart()`调用后立即触发，`readyState=1`|
|3|`xhr.upload.onprogress`|正在上传中，`readyState=1`|
|4|`xhr.upload.onload`|上传成功，`readyState=1`|
|5|`xhr.upload.onloadend`|上传阶段结束，`readyState=1`|
|6|`xhr.onprogress`|下载中，`readyState=3`|
|7|`xhr.onload`|下载成功，`readyState=4`|
|8|`xhr.onloadend`|下载阶段结束，即整个请求结束|
|-|`xhr.onreadystatechange`|`readystate`的任何更改将触发此事件，此方法优先于其它方法调用|
|-|`xhr.onabort`|`xhr.aboard()`调用后后立即触发|
|-|`xhr.ontimeout`|`xhr.timeout`超时后立即触发|
|-|`xhr.onerror`|`NetworkError`发生时触发|
>onabort/ontimeout/onerror后续事件触发
1. readyState立即被设置为4
1. 如果上传未完成，则依次执行如下方法，否则直接从跳到3
    * xhr.upload.onprogress
    * xhr.upload.onabort/ontimeout/onerror
    * xhr.upload.onloadend
1. 之后依次执行
    * xhr.onprogress
    * xhr.onabort/ontimeout/onerror
    * xhr.onloadend

## Progress
示例代码
```javascript
// Excute every 50ms
xhr.onprogress = ev => {
    if (ev.lengthComputable) {
        // Computable
        console.log('Download Progress:', ev.loaded/ev.total)
    } else {
        // UnComputable,ev.total=0
        console.log('Downloading')
    }
}
```
## FormData
FormData是2.0的一个新结构，用来模拟Html的表单请求，并且支持文件上传：
```javascript
let data = new FormData();
// or
let data = new FormData(document.querySelector('form'));

data.append('name', 'bill')
data.append('avatar', document.querySelector('.file-input').files[0]);
console.log(`name is ${data.get('name')}`)

xhr.send(data);
```

## CORS跨域请求
正常同源请求中，ajax会自动把cookie追加到每次请求的Header中，但是跨域请求中，ajax不会自动携带Cookie。如需进行跨域请求并且需要Cookie认证信息，目标主机必须允许跨域访问，并且Access-Control-Allow-Origin里边必须明确指明客户主机，不能直接使用一个通配符 * 代替所有主机:
```
// 设置如下，可是跨域请求时自动携带Cookie等认证信息
xhr.withCredentials=true
```