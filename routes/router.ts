import { Request, Response, Router } from "express";
import Server from '../classes/server';


const router = Router();


router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien!'
    })
});

router.post('/mensajes', (req: Request, res:Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        cuerpo,
        de
    }

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload);
    
    res.json({
        ok: true,
        cuerpo,
        de
    })
});

router.post('/mensajes/:id', (req: Request, res:Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado', payload);
    
    res.json({
        ok: true,
        cuerpo,
        de,
        id
    })
});


// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (req: Request, res: Response) => {
    const server = Server.instance;

    try {
        // Obtén la lista de clientes conectados
        const clientes = Array.from(server.io.sockets.sockets.keys());
        res.json({
            ok: true,
            clientes
        });
    } catch (error: Error | any) {
        res.status(500).json({
            ok: false,
            err: 'Error al obtener la lista de usuarios',
            detalle: error.message // Opcional, para obtener más información sobre el error
        });
    }
});

export default router;