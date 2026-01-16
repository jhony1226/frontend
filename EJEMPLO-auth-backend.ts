// backend/controllers/auth.ts
// Ejemplo de controlador de autenticación para el backend

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura';

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ 
      where: { email },
      include: ['tipoUsuario', 'sucursal'] // Incluir relaciones si las tienes
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        tipoUsuarioId: usuario.tipoUsuarioId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Preparar respuesta (sin enviar la contraseña)
    const usuarioResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      tipoUsuarioId: usuario.tipoUsuarioId,
      sucursalId: usuario.sucursalId
    };

    res.json({
      token,
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registro
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, tipoUsuarioId, sucursalId } = req.body;

    // Validar datos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      tipoUsuarioId: tipoUsuarioId || 2, // Por defecto cobrador
      sucursalId
    });

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: nuevoUsuario.id, 
        email: nuevoUsuario.email,
        tipoUsuarioId: nuevoUsuario.tipoUsuarioId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Preparar respuesta
    const usuarioResponse = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      tipoUsuarioId: nuevoUsuario.tipoUsuarioId,
      sucursalId: nuevoUsuario.sucursalId
    };

    res.status(201).json({
      token,
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Middleware para verificar token
export const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // Agregar usuario al request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
