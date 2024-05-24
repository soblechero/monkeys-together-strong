# Aplicación monkeys-together-strong
Aplicación móvil desarrollada con Ionic

## Estructura del Proyecto
- **mobile-app/**: Código fuente de la aplicación móvil.
  - **test/**: Tests unitarios y de integración e2e.
  - **android/**: Código autogenerado para Android.
  - **ios/**: Código autogenerado para iOS.

- **backend/**: Código del backend.

- **dist/**: Contiene el APK generado para Android.

## Requisitos Previos
- Node.js y npm
- Ionic CLI
- Android Studio

### Instalación de Dependencias Globales
Instalar las herramientas necesarias globalmente:

```sh
npm install -g @ionic/cli@latest native-run@latest
```

## Configuración Inicial

- **Instalar Dependencias**:
   ```sh
   cd mobile-app
   npm install
   ```

- **Configurar Variables de Entorno en Windows**: 

Estas variables son necesarias para que las herramientas de desarrollo localicen el SDK de Android y ejecuten Android Studio y el emulador correctamente:

   - **ANDROID_HOME**: Apunta al directorio del SDK de Android. Necesario para que las herramientas de desarrollo como Gradle encuentren las herramientas del SDK.
     ```
     C:\Users\Usuario\AppData\Local\Android\Sdk
     ```
   - **CAPACITOR_ANDROID_STUDIO_PATH**: Ruta al ejecutable de Android Studio. Necesario para abrir Android Studio desde la línea de comandos con Ionic/Capacitor CLI.
     ```
     C:\Users\Usuario\AppData\Local\Programs\Android Studio\bin\studio64.exe
     ```

## Compilar y Probar la Aplicación
### Android
- **Construir y sincronizar la Aplicación**:
   ```sh
   npm run build
   npx cap sync
   ```

- **Abrir en Android Studio**:
   ```sh
   npx cap open android
   ```

- **Ejecutar en el Emulador**:
   ```sh
   npx cap run android
   ```
#### Alternativa
Se puede utilizar un solo comando de Ionic CLI que combina los pasos anteriores: construcción, sincronización y apertura en Android Studio:

1. **Ejecutar el comando de Ionic CLI**:
   ```sh
   ionic capacitor build android
   ```

### Navegador
- **Ejecutar el Servidor de Desarrollo Local**:
   ```sh
   ionic serve
   ```

- **Simular Dispositivo Móvil**:
   - Abrir las herramientas de desarrollo del navegador (F12).
   - Seleccionar la vista adaptable y eligir un dispositivo móvil.

