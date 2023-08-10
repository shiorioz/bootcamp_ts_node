import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const server = http.createServer();
const port = process.env.PORT || 12345;

server.on("request", async (req, res) => {
  console.log("request url: ", req.url);
  // Content-Type is important for browsers.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  res.writeHead(200, { "content-type": "text/plain" });

  const filePath = "./public" + req.url;

  // fs.readFile(filePath, function (error, content) {
  //   if (error) {
  //     res.writeHead(404);
  //     if (error?.code == "ENOENT") {
  //       res.write("file not exists");
  //     }
  //     res.end();
  //   } else {
  //     res.writeHead(200);
  //     if (filePath.endsWith(".html")) {
  //       res.writeHead(200, { "content-type": "text/html" });
  //     }

  //     if (filePath.endsWith(".jpg")) {
  //       res.writeHead(200, { "content-type": "image/jpeg" });
  //     }

  //     if (filePath.endsWith(".json")) {
  //       res.writeHead(200, { "content-type": "text/json" });
  //     }

  //     if (filePath.endsWith(".ico")) {
  //       res.writeHead(200, { "content-type": "image/x-icon" });
  //     }

  //     res.write(content);
  //     res.end();
  //   }
  // });
  try {
    if (req.url == undefined) throw new Error("url is undefined");
    const filePath = req.url === "/" ? "/index.html" : req.url;
    const file = await fs.readFile(
      path.join(path.resolve(), "public", filePath),
    );
    const mimeTypes: { [key: string]: string } = {
      ".html": "text/html",
      ".json": "text/json",
      ".jpg": "image/jpeg",
      ".ico": "image/x-icon",
    };
    const extname = String(path.extname(req.url)).toLowerCase();
    const contentType: string =
      mimeTypes[extname] || "application/octet-stream";

    res.writeHead(200, { "content-type": contentType });
    res.end(file, "utf-8");
    return;
  } catch (err) {
    console.error("error: ", err);
    const error = err as NodeJS.ErrnoException;

    if (error.code === "ENOENT") {
      res.writeHead(404, { "content-type": "text/plain" });
      return res.end("404 Not Found");
    } else {
      res.writeHead(500, { "content-type": "text/plain" });
      return res.end("500 Internal Server Error");
    }
  }
});

// Start listening 12345 port of localhost (127.0.0.1).
server.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});
console.log("run server.js");
