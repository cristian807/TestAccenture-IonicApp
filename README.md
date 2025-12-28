# 📱 Todo App - Ionic Angular

Aplicación de lista de tareas (To-Do List) desarrollada con Ionic y Angular para la prueba técnica de Accenture.

---

## 📋 Características

- ✅ **Agregar tareas** - Crear nuevas tareas con nombre y descripción
- ✅ **Marcar como completadas** - Toggle para marcar/desmarcar tareas
- ✅ **Eliminar tareas** - Deslizar para eliminar o botón de borrar
- ✅ **Categorías** - Crear, editar y eliminar categorías
- ✅ **Asignar categorías** - Cada tarea puede tener una categoría
- ✅ **Filtrar por categoría** - Ver tareas de una categoría específica
- ✅ **Almacenamiento local** - Las tareas se guardan en el dispositivo
- ✅ **Firebase Remote Config** - Feature flags para activar/desactivar funciones

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js (versión 18 o superior)
- npm (viene con Node.js)
- Ionic CLI

### Paso 1: Instalar Ionic CLI
```bash
npm install -g @ionic/cli
```

### Paso 2: Instalar dependencias
```bash
cd todo-app
npm install
```

### Paso 3: Ejecutar en el navegador
```bash
ionic serve
```
La aplicación se abrirá en `http://localhost:8100`

---

## 📱 Compilar para Android

### Requisitos
- Android Studio instalado
- Java JDK 11 o superior
- Variables de entorno configuradas (ANDROID_HOME, JAVA_HOME)

### Pasos

1. **Agregar plataforma Android:**
```bash
ionic capacitor add android
```

2. **Compilar el proyecto:**
```bash
ionic capacitor build android
```

3. **Abrir en Android Studio:**
```bash
ionic capacitor open android
```

4. **Generar APK:**
   - En Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - El APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🍎 Compilar para iOS

### Requisitos
- macOS con Xcode instalado
- Cuenta de desarrollador Apple (para dispositivos físicos)
- CocoaPods instalado

### Pasos

1. **Agregar plataforma iOS:**
```bash
ionic capacitor add ios
```

2. **Compilar el proyecto:**
```bash
ionic capacitor build ios
```

3. **Abrir en Xcode:**
```bash
ionic capacitor open ios
```

4. **Generar IPA:**
   - En Xcode: `Product > Archive`
   - Luego: `Distribute App > Ad Hoc / Development`

---

## 🔥 Configuración de Firebase

### Paso 1: Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Remote Config

### Paso 2: Configurar Remote Config
En Firebase Console > Remote Config, crear los siguientes parámetros:

| Parámetro | Valor por defecto | Descripción |
|-----------|-------------------|-------------|
| `enable_categories` | `true` | Habilita/deshabilita las categorías |
| `enable_dark_mode` | `false` | Habilita/deshabilita modo oscuro |
| `max_tasks` | `100` | Número máximo de tareas |

### Paso 3: Agregar configuración
Copia la configuración de Firebase en `src/environments/environment.ts`

---

## 📁 Estructura del Proyecto

```
todo-app/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── models/              # Interfaces y tipos
│   │   ├── pages/               # Páginas de la app
│   │   │   ├── home/            # Página principal (lista de tareas)
│   │   │   └── categories/      # Gestión de categorías
│   │   ├── services/            # Servicios (storage, firebase)
│   │   └── app.component.ts
│   ├── environments/            # Configuración de entornos
│   └── theme/                   # Estilos globales
├── android/                     # Proyecto Android (generado)
├── ios/                         # Proyecto iOS (generado)
└── capacitor.config.ts          # Configuración de Capacitor
```

---

## 🎯 Funcionalidades de Feature Flags

La aplicación usa Firebase Remote Config para controlar funcionalidades:

### `enable_categories` (boolean)
- **true**: Muestra el botón de categorías y permite filtrar
- **false**: Oculta toda la funcionalidad de categorías

### Cómo probar:
1. Abre Firebase Console > Remote Config
2. Cambia el valor de `enable_categories` a `false`
3. Publica los cambios
4. Reinicia la app y verás que las categorías desaparecen

---

## ⚡ Optimizaciones de Rendimiento

1. **Lazy Loading**: Las páginas se cargan bajo demanda
2. **Virtual Scroll**: Para listas grandes de tareas
3. **TrackBy**: En *ngFor para optimizar renderizado
4. **OnPush Strategy**: Change detection optimizado
5. **Almacenamiento eficiente**: Uso de Ionic Storage con IndexedDB

---

## 🧪 Respuestas a Preguntas

### ¿Cuáles fueron los principales desafíos?
- Configurar Firebase Remote Config con Ionic/Capacitor
- Manejar el almacenamiento local de forma eficiente
- Implementar el filtrado de categorías manteniendo el estado

### ¿Qué técnicas de optimización aplicaste?
- Lazy loading para reducir el bundle inicial
- Virtual scroll para manejar muchas tareas
- Uso de trackBy en listas
- Almacenamiento con IndexedDB (más rápido que localStorage)

### ¿Cómo aseguraste la calidad del código?
- Separación de responsabilidades (servicios, componentes)
- Tipado estricto con TypeScript
- Interfaces para los modelos de datos
- Código comentado y documentado

---

## 👤 Autor

Cristian Moquera - Prueba Técnica Accenture 2024
