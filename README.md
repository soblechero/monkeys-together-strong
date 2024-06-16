# monkeys-together-strong
Este monorepo alberga la aplicación móvil de recomendación de videojuegos, desarrollada utilizando Ionic con Capacitor y Vue para el frontend, junto con su backend implementado usando FastAPI y SQLModel.


## Estructura de los proyectos
- **mobile-app/**: Código fuente de la aplicación móvil.
  - **test/**: Tests unitarios y de integración e2e.
  - **android/**: Código autogenerado para Android.
  - **ios/**: Código autogenerado para iOS.

- **backend/**: Código fuente del backend.
  - **test/**: Tests unitarios


## Mobile app setup
### Configuración de entornos
Se utilizan ficheros `.env` para gestionar la configuración en diferentes entornos. Las variables a configurar son:

- VITE_API_BASE_URL: URL base del backend de la aplicación.
- VITE_USE_MOCKS: Define si se usa el servicio mock para simular el backend (false para usar el backend real).

### Requisitos previos
- Node.js y npm
- Ionic CLI
- Android Studio

#### Instalación de dependencias globales
Instalar las herramientas necesarias globalmente:

```sh
npm install -g @ionic/cli@latest native-run@latest
```

### Configuración inicial
- **Instalar dependencias**:
   ```sh
   cd mobile-app
   npm install
   ```

- **Configurar variables de entorno en Windows**: 

Estas variables son necesarias para que las herramientas de desarrollo localicen el SDK de Android y ejecuten Android Studio y el emulador correctamente:

   - **ANDROID_HOME**: Apunta al directorio del SDK de Android. Necesario para que las herramientas de desarrollo como Gradle encuentren las herramientas del SDK.
     ```
     C:\Users\Usuario\AppData\Local\Android\Sdk
     ```
   - **CAPACITOR_ANDROID_STUDIO_PATH**: Ruta al ejecutable de Android Studio. Necesario para abrir Android Studio desde la línea de comandos con Ionic/Capacitor CLI.
     ```
     C:\Users\Usuario\AppData\Local\Programs\Android Studio\bin\studio64.exe
     ```

### Construir y probar la aplicación
#### Android
- **Construir y sincronizar la aplicación**:
   ```sh
   npm run build
   npx cap sync
   ```

- **Abrir en Android Studio**:
   ```sh
   npx cap open android
   ```

- **Ejecutar en el emulador**:
   ```sh
   npx cap run android
   ```
##### Alternativa
Se puede utilizar un solo comando de Ionic CLI que combina los pasos anteriores: construcción, sincronización y apertura en Android Studio:

- **Ejecutar el comando de Ionic CLI**:
   ```sh
   ionic capacitor build android
   ```

#### Navegador
- **Ejecutar el servidor de desarrollo local**:
   ```sh
   ionic serve
   ```

- **Simular dispositivo móvil**:
   - Abrir las herramientas de desarrollo del navegador (F12).
   - Seleccionar la vista adaptable y eligir un dispositivo móvil.



## Backend setup
### Configuración de la base de datos
La aplicación utiliza varios ficheros `.env` para gestionar la configuración de la base de datos en diferentes entornos. Se utiliza la variable `ENV_MODE` del fichero `.env` para determinar cuál de los ficheros de entorno cargar (`development`, `testing`, `production`)

- **Desarrollo**:
Se utiliza el fichero `.env.development` que configura la aplicación para crear una base de datos SQLite en el directorio `data`. SQLModel crea automáticamente la base de datos y las tablas correspondientes al iniciar la aplicación.

- **Producción y pruebas**:
Se utilizan los ficheros  `.env.production` y `.env.testing` respectivamente. Estos configuran la conexión a una base de datos PostgreSQL preexistente. Es necesario asegurase que la instancia de la base de datos esté creada para que SQLModel pueda generar las tablas al inicio.


### Requisitos previos
- Python 3.11
- Poetry

#### Instalación de dependencias globales
Instalar Poetry globalmente usando pipx:

```sh
   pipx install poetry
```
### Configuración inicial
- **Instalar dependencias**:
   ```sh
   cd backend
   poetry install
   ```
### Ejecución local del backend
- **Activar el entorno virtual**:
   ```sh
   poetry shell
   ```
- **Iniciar el servidor de desarrollo local**:
   ```sh
   uvicorn app.main:app --reload
   ```

### Documentación interactiva de la API
Acceder a la documentación interactiva generada por FastAPI, la cual utiliza OpenAPI para definir y permitir la prueba de endpoints directamente desde el navegador:

- **Swagger UI**:
   ```
   http://localhost:8000/docs
   ```

- **ReDoc**:
   ```
   http://localhost:8000/redoc
   ```

## Licencia
Este proyecto está licenciado bajo la Licencia Creative Commons Atribución-NoComercial-SinDerivadas 4.0 Internacional (CC BY-NC-ND 4.0). Para ver una copia de esta licencia, visite [https://creativecommons.org/licenses/by-nc-nd/4.0/](https://creativecommons.org/licenses/by-nc-nd/4.0/).