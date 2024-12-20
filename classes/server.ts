import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {
    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;
    private static _instance: Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = new socketIO.Server(this.httpServer, {
            cors: {
                origin: "http://localhost:4200", // Cambia al puerto de tu frontend Angular si es distinto
                methods: ["GET", "POST"]
            }
        });

        this.escucharSockets();
    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {
            // console.log('Cliente conectado');

            // Conectar cliente
            socket.conectarCliente(cliente);

                        
            // Configurar usuario
            socket.configurarUsuario(cliente, this.io);

            socket.mensaje(cliente, this.io);
            socket.desconectar(cliente, this.io);
        })
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    start(callback: () => void) {
        this.httpServer.listen(this.port, callback);
    }    
}