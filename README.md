# Sistema de Gestión de Laboratorio Clínico (Entrega Final - Actividad 4)

Proyecto desarrollado por Andy Martínez C.I: 84.491.009 para la materia de Backend (Ingeniería De La Programación).

Este proyecto es una plataforma integral para la gestión de pacientes, exámenes médicos, inventario y facturación, desarrollada con **Node.js, Express y SQLite3**.

## 🚀 Entrega Final (Actividad 4)
Para esta fase final, el enfoque se centró en el pulido de la lógica de negocio, la optimización de consultas y la integración total entre el Backend y el Frontend:

- **Optimización de Consultas SQL:** Implementación de filtrado dinámico (`DISTINCT`) para evitar la duplicidad de tipos de exámenes en los selectores de configuración y órdenes médicas.
- **Sincronización de Rutas y Controladores:** Refactorización de la arquitectura de rutas para garantizar la coherencia entre los archivos físicos y las importaciones de Node.js.
- **Corrección de Endpoints de la API:** Estandarización de rutas (`/api/examenes/unicos`) para mejorar la eficiencia de las peticiones `fetch` desde las vistas EJS.
- **Persistencia y Estabilidad:** Pruebas finales de flujo de usuario, desde la creación de pacientes hasta la generación de órdenes y resultados en formato PDF.

## 🛠️ Características Previas (Actividad 3)
- **Autenticación JWT:** Implementación de JSON Web Tokens para sesiones seguras.
- **Control de Acceso por Roles (RBAC):** Diferenciación entre usuarios `ADMIN` y `USER`.
- **Validación de Datos:** Protección del servidor contra datos nulos o inconsistentes.
- **Persistencia Segura:** Uso de `localStorage` para el manejo de tokens en el frontend.

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <url-de-tu-repositorio>
   cd nombre-del-proyecto

2. **Instalar dependencias:**
    ```bash
    npm install
   

3. **Configurar variables de entorno:**
   - Crea un archivo .env basado en .env.example y define tu JWT_SECRET.

4. **Inicializar Base de Datos:**
    - Si es la primera vez, ejecuta las migraciones para crear las tablas y el usuario administrador inicial:

5. **Iniciar el servidor:**
    ```bash
    npm run migrate