const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString().split("\r\n")
        const path = request[0].split(" ")[1]
        const contentParseArray = path.split("/")
        const content = contentParseArray[contentParseArray.length - 1]

        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n${content}`)

        // if (path === "/") {
        //     socket.write("HTTP/1.1 200 OK\r\n\r\n")
        // } else {
        //     socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
        // }
    })

    socket.on("close", () => {
        socket.end();
        server.close();
    });
});

server.listen(4221, "localhost");