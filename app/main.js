const net = require("net");
const fs = require("fs");
const p = require("path");

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
        // Status Codes
        const res_200 = "HTTP/1.1 200 OK";
        const res_201 = "HTTP/1.1 201 Created";
        const res_404 = "HTTP/1.1 404 Not Found";
        const res_500 = "HTTP/1.1 500 Internal Server Error";

        // Response Body
        const request = data.toString().split("\r\n");
        console.log(`This is the request: ${request}`);
        const path = request[0].split(" ")[1];
        const httpMethod = request[0].split(" ")[0];
        const contentParseArray = path.split("/");
        const content = contentParseArray[contentParseArray.length - 1];

        let response = "";

        if (path === "/") {
            response = `${res_200}\r\n\r\n`;
        } else if (httpMethod === "POST" && path.includes("files")) {
            const fileIDX = path.split("/").indexOf("files") + 1;
            const fileName = path.split("/")[fileIDX];
            const dirIDX = process.argv.indexOf("--directory");
            const dir = process.argv[dirIDX + 1];
            const filePath = p.join(dir, fileName);
            const contentType = "application/octet-stream";

            console.log(`req body: ${request[request.length - 1]}`);

            fs.writeFileSync(filePath, request[request.length - 1]);
            response = `${res_201}\r\n\r\n`;
        } else if (httpMethod === "GET" && path.includes("files")) {
            const fileIDX = path.split("/").indexOf("files") + 1;
            const fileName = path.split("/")[fileIDX];
            const dirIDX = process.argv.indexOf("--directory");
            const dir = process.argv[dirIDX + 1];
            const filePath = p.join(dir, fileName);
            const contentType = "application/octet-stream";

            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, "utf-8");
                response = `${res_200}\r\nContent-Type: ${contentType}\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}`;
            } else {
                response = `${res_404}\r\nContent-Type: ${contentType}\r\nContent-Length: 0\r\n\r\n`;
            }
        } else if (path.includes("user-agent")) {
            const headers = request[2];
            const userAgentHeader = request[2].split(": ")[1];

            response = `${res_200}\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentHeader.length}\r\n\r\n${userAgentHeader}`;
        } else if (path.includes("echo")) {
            response = `${res_200}\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
        } else {
            response = `${res_404}\r\n\r\n`;
        }

        console.log(response);
        socket.write(response);
    });
});

server.listen(4221, "localhost");
