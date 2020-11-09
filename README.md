## AMERICAN TOWER

Este proyecto es desarrollado con la tecnología [`ReactJS`](https://es.reactjs.org) que es un framework de desarrollo web, permitiendo la construcción de una plataforma web creada con componentes reactivos que crean una interacción más dinámica y con una mejor respuesta a los eventos; por dicha naturaleza, el desarrollo está hecho con el lenguaje de programación `JavaScript` que permite un completo adecuamiento con el framework utilizado ya que con el mismo lenguaje que está desarrollado.

Además del framwork [`ReactJS`](https://es.reactjs.org) fue utilizada la librería de estilos [`Semantic-UI`](https://semantic-ui.com) que proporciona una forma rápida de estilizar los elementos que la mayoría de las plataformas web necesitan, con lo cual hace más rápido el desarrollo de las interfaces visuales y mantiene una forma de trabajo unificada, que es ideal para la modificación y adecuación de elementos posteriores.

El enrutamiento interno del sitio fue creado con el plugin [`react-router-dom`](https://reacttraining.com/react-router/web/guides/quick-start) que es una dependencia cargada via el repositorio [`npm`](https://www.npmjs.com), y es controlado dentro del archvio "src/souter.js"

### Estructura del proyecto

El proyecto esta compuesto por el siguinete árbol de archvios:
```bash
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo.png
│   ├── manifest.json
│   └── robots.txt
├── semantic.json
└── src
    ├── components
    │   ├── getAccess.js
    │   ├── SideMenu.js
    │   └── StatusBar.js
    ├── images
    │   ├── AmeTow.png
    │   └── AmeTow.svg
    ├── index.js
    ├── pages
    │   ├── generador.js
    │   ├── Login.js
    │   ├── newContract.js
    │   ├── plantillas
    │   │   └── compraVenta.js
    │   ├── secciones
    │   │   ├── cierre.js
    │   │   ├── participantes.js
    │   │   ├── sectionStyle.css
    │   │   └── titulo.js
    │   └── validador.js
    ├── router.js
    ├── semantic
    │   ├── dist
    │   │   
    │   ├── gulpfile.js
    │   ├── src
    │   └── tasks
    ├── serviceWorker.js
    └── styles
        └── globals.css
```

Dentro de la carpeta /public se encuentra el archivo html inicial donde ReactJS se encarga de cargar de manera dinámica todos los componentes, de igual forma estan el ícono y el logo del proyecto.

En la carpeta /src se encuentra toda la programación del proyecto, comenzando por el archivo index.js que es el encargado de renderizar los componentes de ReactJS, también se encuentra el archivo App.js que es el manejador de rutas dentro del sitio una vez que se despliega. Además se encuntran las carpetas /components y /pages que contienen los componentes del sitio y con uns estructura y nombre lo más precisos a su contenido posible.

### Desarrollo e Instalación

El modo de desarrollo de estre proyecto se puede acceder a él una vez que se tenga instalado [`NodeJS`](https://nodejs.org/en/), donde al instalarlo también se instala el manejador de dependecias [`npm`](https://www.npmjs.com) y al correr el comando:
````
npm install //Se instalan las dependencias necesarias que son descritas en el package.json
npm start //Inicializa un pequeño servidor para correr el proyecto en modo debug
````
Si lo que se quiere es generar el compilado rl proyecto pra ponerlo en producción se coloca el siguiente comando en la consola:
````
npm run build //Genera el compilado de archvios estáticos en la carpeta dist
````
### Accesos temporales

Desde el login para acceder al perfil de Generador se debe usar el correo `generador@itza.io` y una contraseña válida para el sistena de autenticación, de igual modo para acceder al perfil de validador el correo a usar es `validador@itza.io` con una contraseña válida para el sistema de validación.
