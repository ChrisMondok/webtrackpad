Web Trackpad
============

Forwards mouse and keyboard events to the server.
Currently, the server ignores any keyboard event that's not control.

Setup
-----
The server depends on `x11`, `ws`, and `express`, all of which can be npm'd.


Running
-------
Run `node server.js` from the root of the project. The server will start listening on port 9000. Visit the page on any browser that supports web sockets and click away!

Notes
-----
- There is no authentication of any means. I wouldn't go running this over the internet, and you should probably have a firewall.
- The X11 dependency means that the server works on linux I have no idea if node's x11 works on windows (with xming), nor if it works on MacOS. If you find out, tell me!
