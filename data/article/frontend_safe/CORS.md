# CORS跨域请求
>W3C目前尚未将CORS标准化，跨域请求的实现依赖各大浏览器和服务器的支持。

## CORS

    跨域指的是Web客户端访问其它服务器的资源。默认情况下，浏览器处于安全性考虑，不允许进行跨域访问，除非其它服务器允许跨域访问。

## 解决方法

    假设当前主机为http://localhost，需要访问的主机为http://www.example.com
    
* 设置Header使服务器允许跨域访问

    客户端仍然像正常请求一样执行跨域请求，但是服务端需要允许跨域请求。
    跨域请求分为*简单请求*和*复杂请求*两种。简单请求的判断条件如下：
    
    1. 只能使用的方法：
        * GET
        * POST
        * HEAD
    2. 只修改了以下Header：
        * Accept
        * Accept-Language
        * Content-Language
        * Content-Type
    3. Content-Type只能为以下类型
        * application/x-www-form-urlencoded  
        * multipart/form-data  
        * text/plain  

    **简单请求的跨域**

    服务端需要在响应头内添加允许目标客户端访问的Header：
    ```
    Access-Control-Allow-Origin: www.example.com
    ```

    **复杂请求的跨域**

    服务端需要监听OPTIONS请求并允许请求。原理如下：
    POST请求先发送OPTIONS请求，即preflight。OPTIONS请求中包含需要服务端允许的Method、Header以及Origin主机。服务端允许preflight请求后，浏览器再重新发送完整的POST请求，然后完成响应。过程如下：

    ```
    // 执行跨域POST请求
    POST http://www.example.com HTTP/1.1
    Host: www.example.com
    Connection: keep-alive
    User-Agent: Chrome/69.0.3497.92
    Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    Origin: http://localhost:3000
    Content-Type: application/x-www-form-urlencoded
    Referer: http://www.example.com
    Accept-Encoding: gzip, deflate  
    Accept-Language: zh-CN,zh;q=0.8

    // 浏览器自动发送Preflight(OPTIONS请求)，本次请求中
    // Cookie的Header属于复杂请求，OPTIONS的Header中包含了所有
    // 跨域的信息。
    OPTIONS http://www.example.com HTTP/1.1
    Access-Control-Allow-Headers: Cookie
    Access-Control-Allow-Method: POST
    Access-Control-Allow-Origin: http://localhost:3000

    // 响应OPTIONS，服务端允许Header中添加Cookie
    HTTP/1.1 200 OK
    Access-Control-Allow-Headers: Cookie
    Access-Control-Allow-Method: Post

    // 如果OPTIONS请求成功，浏览器会发送正常的POST请求
    ```

* jsonp方法

    jsonp是另一种思路的跨域实现，利用跨域请求资源的方式实现，因为html中的src资源是不受跨域限制的，比如img、javascripts、iframe等等。jsonp实际上是用GET方法跨域请求了一个javascripts脚本，然后目标主机将数据写入了脚本内的回调方法中。具体如下：
    * 客户端
    ```javascript
    // 回调方法
    function cb(data) {
        console.log(data)
    }
    // 直接GET请求结果即可，必须告诉服务器回调方法的名字
    xhr.open('GET', 'http://www.example.com?username=bill&callback=cb', true);
    xhr.send();
    ```
    * php服务端
    ```php
    $username = $_GET['username'];

    ... // query database

    // 发送的其实是个javascript方法，data作为参数传入
    print $_GET['callback'] . '(' . data . ')';
    ```
