const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

/*
    Start line
    GET /index.html HTTP/1.1
    -- HTTP method | Path | HTTP Version --

    Headers:
    Host: localhost:4221
    User-Agent: curl/7.64.1
*/

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        // Status line
        const httpVersion = "HTTP/1.1";
        const successCode = "200 OK";
        const notFoundCode = "404 Not Found";

        // Headers

        // Response Body

        const request = data.toString().split("\r\n");
        const path = request[0].split(" ")[1];
        const contentParseArray = path.split("/");
        const content = contentParseArray[contentParseArray.length - 1];

        if (path === "/") {
            socket.write(`${httpVersion} ${successCode}\r\n\r\n`);
        } else if (path.includes("user-agent")) {
            const headers = request[2];
            const userAgentHeader = request[2].split(": ")[1];

            socket.write(
                `${httpVersion} ${successCode}\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentHeader.length}\r\n\r\n${userAgentHeader}`
            );
        } else if (path.includes("echo")) {
            socket.write(
                `${httpVersion} ${successCode}\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
            );
        } else {
            socket.write(`${httpVersion} ${notFoundCode}\r\n\r\n`);
        }
    });

    // socket.on("close", () => {
    //     socket.end();
    //     server.close();
    // });
});

server.listen(4221, "localhost");
