# chat.js
This is a Chat program written in Node.js.  
It's running here. <http://myon.info:3000/>

## Requirements
* Node.js
* MySQL (or MariaDB) and database

## Usage
Install dependencies:

    npm install crypto mime mysql socket.io

Create Table:

    create table caht_logs(id int auto_increment primary key,date datetime,ip varchar(20),name varchar(20),text varchar(200));

Modify `chat.js` and `www/index.html`.

Run:

    node chat.js

## License
### chat.js
The MIT License (MIT)

Copyright (c) 2014 Tosainu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

### bootstrap
> The MIT License (MIT)
> 
> Copyright (c) 2011-2014 Twitter, Inc

<https://github.com/twbs/bootstrap/blob/master/LICENSE>
