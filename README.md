# Sistema de Gestión de Laboratorio Clínico (Actividad 3)

Proyecto desarrollado por Andy Martínez C.I: 84.491.009 para la materia de Backend (Ingeniería De La Programación).

Este proyecto es una plataforma integral para la gestión de pacientes, exámenes médicos, inventario y facturación, desarrollada con **Node.js, Express y SQLite3**.

## Nuevas Características (Actividad 3)
- **Autenticación JWT:** Implementación de JSON Web Tokens para sesiones seguras.
- **Control de Acceso por Roles (RBAC):** Diferenciación entre usuarios `ADMIN` y `USER`.
- **Validación de Datos:** Protección del servidor contra datos nulos o inconsistentes.
- **Persistencia Segura:** Uso de `localStorage` para el manejo de tokens en el frontend.

## Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <url-de-tu-repositorio>
   cd nombre-del-proyecto

2. **Instalar dependencias:**
    ```bash
    npm install

3. **Configurar variables de entorno:**
    Crea un archivo .env basado en .env.example y define tu JWT_SECRET.

4. **Inicializar Base de Datos:**
    Si es la primera vez, ejecuta las migraciones para crear las tablas y el usuario administrador inicial:

    ```bash
    npm run migrate