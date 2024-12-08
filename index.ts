import Server from "./classes/server";

const server = new Server();

server.start( () => {
    console.log(`El servidor corriendo en ${server.port}`)
} ) 