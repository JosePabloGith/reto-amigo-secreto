/*
    NUEVA ACTUALIZACION ENCONTRDA, MANEJAR NOMBRES NO ES UNA TAREA FACIL
    ES POR ESO QUE DEBEBEMOS DE APLICAR LA FAMOSA FRASE
    DIVIDE Y VENCERAS

    NO SOLO DEJES UN RECUADRO PARA INGRESAR TODO EL NOMBRE COMPLETO
    YA QUE TARDE O TEMPRANO TE DARAS CUENTA QUE:
    HAY NOMBRES QUE SE USAN COMO APELLIDOS
    HAY APELLIDOS QUE SE USAN COMO NOMBRES
    --TODO UN DESPAPAYE--
    ES POR ESO QUE DEBES DE MANEJAR ALMENOS 2 RECUADROS
    UNO PARA LOS NOMBRES Y OTRO PARA LOS APELLIDOS 
    DE ESTA MANERA EN CODIGO PODRAS DETERMINAR 
    QUE ES QUE.

    ESTA PROBLEMATICA SE ENCUENTRA EN ESTE CODIGO
    DEBIDO A QUE SE IMPLEMENTO UNA SOLA CASILLA DE INGRESO DE DATOS

*/
// Arrays para almacenar los datos
/////ESTATUS FUNCIONAL 

let nombresHombres = [];
let nombresMujeres = [];
let apellidosComunes = [];
let observador = false ;
let flagNombreCompleto = false;
let fraseCondicional = "";
// Bandera para permitir el espacio final como una "tarjeta amarilla"
let validacionEspacioFinal = false;




// Referencias a los elementos
const btnAgregar = document.getElementById('btnAgregarNombre');
const btnSortear = document.getElementById('btnSortear');
const btnNewGame = document.getElementById('btnNewGame');
const ulListAmigos = document.getElementById('listaAmigos');
const ulResultado = document.getElementById('resultado');
const areaIngreso = document.getElementById('areaIngreso');



///////////////////////////////////
// Función para cargar un archivo CSV y extraer una columna específica
function cargarCSV(ruta, columnaObjetivo, arrayDestino) {
    fetch(ruta)
        .then(response => response.text())
        .then(text => {
            Papa.parse(text, {
                header: true, // Indica que el CSV tiene encabezados
                skipEmptyLines: true, // Ignorar líneas vacías
                complete: function(results) {
                    arrayDestino.length = 0; // Limpiar el array antes de llenarlo
                    results.data.forEach(row => {
                        if (row[columnaObjetivo]) {
                            arrayDestino.push(row[columnaObjetivo].toUpperCase().trim());
                        }
                    });

                    // 📌 ORDENAR la lista para que funcione la búsqueda binaria
                    arrayDestino.sort();

                    ///--debugg--console.log(`📄 Archivo ${ruta} cargado. Total: ${arrayDestino.length} elementos.`);
                }
            });
        })
        .catch(error => console.error(`❌ Error cargando ${ruta}:`, error));
}

// Función de búsqueda binaria
function busquedaBinaria(arr, valor) {
    let izquierda = 0;
    let derecha = arr.length - 1;

    while (izquierda <= derecha) {
        let medio = Math.floor((izquierda + derecha) / 2);
        let elemento = arr[medio];

        if (elemento === valor) {
            return true; // Encontrado
        } else if (elemento < valor) {
            izquierda = medio + 1; // Buscar en la mitad derecha
        } else {
            derecha = medio - 1; // Buscar en la mitad izquierda
        }
    }
    return false; // No encontrado
}

// Eventos de entrada en la caja de texto
areaIngreso.addEventListener('input', adaptarTexto);
areaIngreso.addEventListener('input', validarNombre);

function pantallaInicial() {
    limpiarListaAmigos();
    limpiarListaSorteado();
    cambiarEstadoElemento(btnSortear, "desactivar");
    cambiarEstadoElemento(btnNewGame, "desactivar");
    // Cargar cada CSV al iniciar
    cargarCSV('nombreHombres.csv', 'nombre', nombresHombres);
    cargarCSV('nombreMujeres.csv', 'nombre', nombresMujeres);
    cargarCSV('apellidos.csv', 'apellido', apellidosComunes);
}

function pantallaFinal(){
    refrescarVariables();
    limpiarListaAmigos();
    limpiarListaSorteado();
    cambiarEstadoElemento(btnSortear, "desactivar");
    cambiarEstadoElemento(btnNewGame, "desactivar");
}

function juegoNuevo(){
    
    if(window.confirm("se eliminaran la lista de amigos ingresada, ¿deseas continuar?")){
        pantallaFinal();
    }else{
        return;
    }
}

function limpiarListaAmigos() {
    ulListAmigos.innerHTML = '';
}

function limpiarListaSorteado() {
    ulResultado.innerHTML = '';
}

function refrescarVariables(){

    observador = false ;
    flagNombreCompleto = false;
    fraseCondicional = "";
    // Bandera para permitir el espacio final como una "tarjeta amarilla"
    validacionEspacioFinal = false;

}


function cambiarEstadoElemento(elemento, estado) {
    if (!elemento) {
        // ---debug--console.log("Elemento no encontrado");
        return;
    }

    elemento.style.pointerEvents = (estado === "desactivar") ? "none" : "auto";
    elemento.style.opacity = (estado === "desactivar") ? "0.5" : "1";
}

// Función para agregar amigos
function agregarAmigo() {

    ///////////////
        //limpiamos en caso de existir algun dato ulResultado
        ulResultado.innerHTML = '';
        
    ///////////////

    const nombre = areaIngreso.value.trim();
    const longNombre = nombre.length;

    if (nombre === "") {
        alert("No puedes ingresar datos vacíos");
        return;
    }

    if (longNombre < 3) {
        alert("NO HAY NOMBRES TAN PEQUEÑOS");
        return;
    }

    pantallaSecuencial();

    if(fraseCondicional == "YES" ){   

        //aqui ya se desidio que lo que este en el cuadro es valido
        //pero aun puede pasar que ya exista el elemento dentro de nuestra lista de amigos
        //hay 3 esenarios

        //que no tenga nada adentro
        //que la lista de amigos contenga el elemento que queremos agregar
        //que el elemento a agregar es unico, osease no esta previamente en las listas

        //si no hay nada dentro de la lista de amigos no es necesario hacer la comprobacion de iguldades de contencion

        if(ulListAmigos.childElementCount == 0){
            //no hay elementos previos :D
            const li = document.createElement('li');
            li.textContent = nombre;
            ulListAmigos.appendChild(li);
            areaIngreso.value = "";
        }else{
            //dentro de la lista de amigos ingresado hay mas de 1 elemento
            //existe la posibilidad de ingresar repeticiones 

            //guardamos lo que esta en la caja de texto como un string
            let nombreIngresado = areaIngreso.value;

            //nececitamos guardar todo los datos ingresados en la caja ulNombresIngresados en un array
            const listaDeAmigos = ulListAmigos.querySelectorAll('li');
        
            //convertir la nodeList a un array y obtener solo el texto de cada <li>
            const arrayAmigos = Array.from(listaDeAmigos).map(item => item.textContent);

            if(arrayAmigos.includes(nombreIngresado)){
                //encontramos duplicacion
                alert("EL NOMBRE YA FUE INGRESADO");
                //limpiamos el areaDetexto
                areaIngreso.value = ""
                return ; //conexion a tierra
            }

            const li = document.createElement('li');
            li.textContent = nombre;
            ulListAmigos.appendChild(li);
            areaIngreso.value = "";

        }

        //aqui es donde decidimos activar los botones sortearAmigo y newGame
        if(ulListAmigos.querySelectorAll('li').length >=2){
            //hay almenos dos elementos
            cambiarEstadoElemento(btnSortear, "activar");
            cambiarEstadoElemento(btnNewGame, "activar");
            
        }

    }

}

function sortearAmigo(){


    
    //si sensorElementoPrevio es true entonces hay mas de un elemento dentro de la lista de amigoSorteado
    //esto existe debido a que puede existir un amigo sorteado, debido a que se ha 
    //pulsado mas de una vez el boton sortear amigo
    let sensorElementoPrevio = ulResultado.childElementCount > 0 ;
                //--debugg-- console.log(`sensorElementPrev: ${sensorElementoPrevio}`);
    if(sensorElementoPrevio == true){
        //debemos evitar  que el elemento sorteado  no sea igual al anterior
        let guardadoPrevio = ulResultado.querySelector('li');
        let amigoSortanterior = guardadoPrevio.textContent;
                    //--debugg-- console.log(amigoSortanterior);


        //limpiamos la listaAmigoSorteado por si hay algo en ella
        

        //en este paso entraremos si y solo si hay minimo 2 amigos en la lista ulListaamigos
        //obtener todos los <li> dentro del <ul>

        const listaDeAmigos = ulListAmigos.querySelectorAll('li');
        
        //convertir la nodeList a un array y obtener solo el texto de cada <li>
        const arrayAmigos = Array.from(listaDeAmigos).map(item => item.textContent);
        // --debugg-- console.log(`listaDeAmigos: ${arrayAmigos}`);
        //en este punto tenemos solo un string con el nombre sorteado
        let nombreSeleccionado = escogerNombreAlazar(arrayAmigos);



        while(nombreSeleccionado == amigoSortanterior){
            //aqui saldremos si y solo si hay diferentes amigos seleccionados
            //nececitamos buscar otro amigo al azar

            //cuidado no olvides enviar la lista de arrayAmigos
            nombreSeleccionado = escogerNombreAlazar(arrayAmigos);

        }
        //aqui llegaremos si y solo si sellecionarAmigoAlAzar es distinto al amigoSortanterior

        //creamos el <li>
        const elementoLi = document.createElement('li');
        elementoLi.textContent = nombreSeleccionado;
        
        limpiarListaSorteado();

        //agregamos el amigo sorteado
        ulResultado.appendChild(elementoLi);


    }else{
        //no hay nada dentro de la lista de amigo sorteado :D
        //limpiamos la lista por si hay algo en ella
        


        //en este paso entraremos si y solo si hay minimo 2 amigos en la lista ulListaamigos
        //obtener todos los <li> dentro del <ul>

        const listaDeAmigos = ulListAmigos.querySelectorAll('li');
        
        //convertir la nodeList a un array y obtener solo el texto de cada <li>
        const arrayAmigos = Array.from(listaDeAmigos).map(item => item.textContent);

        //en este punto tenemos solo un string con el nombre sorteado
        let nombreSeleccionado = escogerNombreAlazar(arrayAmigos);

        /*SERIA BUENA IDEA DETERMINAR SI EL NOMBRE INGRESADO ES IGUAL O DIFERENTE AL ANTERIOR*/

        //creamos el <li>
        const elementoLi = document.createElement('li');
        elementoLi.textContent = nombreSeleccionado; 
        limpiarListaSorteado();
        //agregamos el amigo sorteado
        ulResultado.appendChild(elementoLi);

    }

}

// Función para adaptar el texto (permite Ñ y espacios)
function adaptarTexto(event) {
    let valor = event.target.value;
    valor = valor.replace(/[^A-Za-zÑñ\s]/g, ""); // Mantener letras, espacios y Ñ
    event.target.value = valor.toUpperCase(); // pasar toso a mayuscula
}

// Función para validar nombres y apellidos
// Función para validar nombres y apellidos (ahora revisa en nombresHombres y nombresMujeres)
function validarNombre(event) {
    let valor = event.target.value;
    const preposiciones = ["DE", "LA", "DEL", "DI", "VAN", "VON"];
    let mensajeError = "";
    let nombresEncontrados = 0;
    let apellidosEncontrados = 0;

    if (valor.startsWith(" ")) {
        event.target.value = valor.trimStart();
        return;
    }

    if (valor.length > 35) {
        mensajeError = "El nombre es demasiado largo (máx. 35 caracteres)";
        valor = valor.slice(0, 35);
    }

    // Evitar más de 2 espacios consecutivos (respetando espacios normales)
    valor = valor.replace(/\s{2,}/g, " ");
    
    const palabras = valor.split(" ");

    // Validar si todas las palabras están en los arrays de nombres o apellidos (usando búsqueda binaria)
    const palabrasValidas = palabras.every(palabra => 
        busquedaBinaria(nombresHombres, palabra) || 
        busquedaBinaria(nombresMujeres, palabra) || 
        busquedaBinaria(apellidosComunes, palabra) || 
        preposiciones.includes(palabra)
    );

    if (!palabrasValidas) {
        mensajeError = "El nombre ingresado no se encuentra en la BD.";
    }

    // Filtramos las palabras que sean válidas (de al menos 3 caracteres o preposiciones)
    const palabrasFiltradas = palabras.filter(p => p.length >= 3 || preposiciones.includes(p));

    // Validar cantidad de palabras (mínimo 2, máximo 5)
    if (palabrasFiltradas.length < 3) {
        mensajeError = "Debe ingresar al menos un nombre, apellido paterno y apellido materno";

    } else if (palabrasFiltradas.length > 5) {
        mensajeError = "Solo se permiten hasta 5 palabras en un nombre completo";
        valor = palabrasFiltradas.slice(0, 5).join(" ");
    }

    // Aquí, calculamos si hay al menos un nombre y exactamente dos apellidos
    const nombres = palabrasFiltradas.filter(p => busquedaBinaria(nombresHombres, p) || busquedaBinaria(nombresMujeres, p));
    const apellidos = palabrasFiltradas.filter(p => busquedaBinaria(apellidosComunes, p));

    //--debugg-- console.log(`nombres detectados: ${nombres.length}`);
    //--debugg-- console.log(`apellidos detectados: ${apellidos.length}`);
    // Cambiar fraseCondicional según la cantidad de nombres y apellidos
    if (nombres.length >= 1 && apellidos.length === 2) {
        flagNombreCompleto = true;
    } else {
        flagNombreCompleto = false;
    }

    // Mostrar mensaje de error si existe
    const errorElemento = document.getElementById("errorMensaje");
    if (mensajeError) {
        errorElemento.textContent = mensajeError;
        observador = false; //<---- aqui es donde indicamos que no es valido ingresar los datos
        errorElemento.style.display = "block";
        event.target.value = "";
    } else {
        observador = true;
        errorElemento.textContent = "";
        errorElemento.style.display = "none";
    }

    event.target.value = valor.toUpperCase();
}

function pantallaSecuencial() {
    // Primero, asegurarnos que lo que está en la caja sea un nombre
    if (observador === true) {
        // Revisamos si solo hay un espacio al final
        if (areaIngreso.value.endsWith(" ") && areaIngreso.value.trim().length > 0) {
            validacionEspacioFinal = true; // Permitimos el espacio al final como una excepción
        } else {
            validacionEspacioFinal = false; // No hay espacio al final, es un nombre válido completo
        }

        //--debugg-- console.log("TODO EN ORDEN JEFE");
        fraseCondicional = "YES";  // El nombre pasa la validación si no hay otros problemas
    } else {
        //--debugg-- console.log("NO ES VALIDO SEÑOR");
        fraseCondicional = "NO";  // Si no pasó la validación, lo rechazamos
        validacionEspacioFinal = false; // Aseguramos que la tarjeta amarilla no esté activa si el nombre es inválido
    }
}


/////////////////////////
function actualizarColorBoton() {
    if (areaIngreso.value.trim() === "") {
        btnAgregar.style.backgroundColor = ""; // Color por defecto
    } else if (observador) {
        btnAgregar.style.backgroundColor = "green"; // Nombre válido
    } else {
        btnAgregar.style.backgroundColor = "red"; // Nombre inválido
    }
}

// Modificar el evento de entrada para actualizar el color del botón
areaIngreso.addEventListener("input", () => {
    validarNombre({ target: areaIngreso });
    actualizarColorBoton();
});

// También aseguramos que se actualice cuando se intenta agregar un nombre
btnAgregar.addEventListener("click", () => {
    actualizarColorBoton();
});
/////////////////////////




///metodos de interaccion con los datos entrantes, nececitas ingresar un array como parametro
function escogerNombreAlazar(array){

    //para este punto el codigo debe de ser puro
    //osease no debe de haber problemas con el contenido del array

    let tamArray = array.length ;
    if(tamArray === 0){
        alert("no hay ningun elemento en el array de seleccion de nombres");
        return null ;
    }
    //nosotros escogeremos un elemento de un array al asar
    //recordando que los elementos dentro de un array comiezan con 0

    /**
     * si tenemos por ejemplo [1][2][3][4][5][6]
     *                         0  1  2  3  4  5
     * podras observar que dentro del array hay 6 elementos
     * para acceder al primer elemento debes apuntar a la posicion 0
     * 
     * para acceder al ultimo, tenemos que acceder a una formula
     * la cual es basicamente (cnatidadDeElementosEnElArray) - 1
     * 
     * si nosotros aplicamos esta formula en nuestro array podremos observar su funcionamiento.
     * 
     * (cnatidadDeElementosEnElArray) - 1   == (6)-1 = 5  ---->  puedes darte cuenta de que ese 5
     * representa la posicion del ultimo elemento de nuestro array
     * 
     * tenemos que generar un numero aleatorio entre 0 y (cantidadDeElementosEnElArray - 1 )
     */
    let nMaximo =  tamArray - 1;
    let nMinimo = 0 ;  //--> por defecto los array comienzan su posicion con cero

    let numeroAleatorio = Math.floor( Math.random()*(nMaximo - nMinimo + 1) + nMinimo);

    //tenemos un numero entre 0 y nElementos-1  

    let nombreSorteado = array[numeroAleatorio];

    return nombreSorteado;
    
}

// Inicialización de la pantalla
pantallaInicial();



/**
 * `document.getElementById('ID')`:
 * Obtiene un elemento HTML basado en su ID. El ID debe ser único dentro del documento HTML. 
 * Ejemplo: `document.getElementById('areaIngreso')` obtiene el campo de texto donde el usuario escribe el nombre.
 * Este método es útil para acceder a elementos específicos de la página para manipular su contenido o estilo.
 */

/**
 * `element.value`:
 * Propiedad utilizada para obtener o establecer el valor de los elementos `<input>`, `<textarea>`, etc. 
 * En este caso, `document.getElementById('areaIngreso').value` obtiene el texto que el usuario escribe en el campo de texto.
 */

/**
 * `element.textContent`:
 * Propiedad utilizada para obtener o establecer el contenido textual de un elemento HTML. 
 * En este caso, `li.textContent = nombre` establece el texto dentro del `<li>` creado con el nombre de amigo.
 * Esta propiedad se utiliza para manipular solo el contenido textual, no el HTML interno.
 */

/**
 * `.trim()`:
 * Método de cadenas que elimina los espacios en blanco al principio y al final de una cadena. 
 * Es útil para evitar que el usuario ingrese solo espacios en blanco. Ejemplo: `"  Juan  ".trim()` se convierte en `"Juan"`.
 */

/**
 * `.includes(valor)`:
 * Método de arrays que devuelve `true` si el valor proporcionado está presente en el array. Si no está presente, devuelve `false`. 
 * En este código, `listaDeAmigos.includes(nombre)` verifica si el nombre ya existe en la lista de amigos antes de agregarlo.
 */

/**
 * `.push(elemento)`:
 * Método de arrays que agrega un elemento al final de la lista. 
 * En este caso, `listaDeAmigos.push(nombre)` agrega el nombre a la lista de amigos.
 */

/**
 * `.createElement('tag')`:
 * Método de `document` que crea un nuevo elemento HTML especificado como argumento. 
 * Ejemplo: `document.createElement('li')` crea un nuevo elemento `<li>`.
 */

/**
 * `.appendChild(elemento)`:
 * Método que agrega un nodo (elemento) como hijo de otro nodo (elemento). 
 * Ejemplo: `ulResultado.appendChild(li)` agrega el nuevo `<li>` con el amigo secreto a la lista de resultados.
 */

/**
 * `Math.random()`:
 * Función matemática que devuelve un número decimal aleatorio entre 0 (inclusive) y 1 (exclusivo). 
 * En el código, se usa para generar un número aleatorio que luego se multiplica por el tamaño de la lista de amigos disponibles para seleccionar un índice aleatorio.
 */

/**
 * `Math.floor(numero)`:
 * Función matemática que redondea un número hacia abajo al entero más cercano. 
 * Ejemplo: `Math.floor(2.9)` devuelve `2`. Se usa para asegurarse de que el índice generado sea un número entero válido.
 */

/**
 * `.splice(indice, cantidad)`:
 * Método de arrays que cambia el contenido de un array eliminando o reemplazando elementos. 
 * En este caso, `amigosDisponibles.splice(index, 1)` elimina un amigo aleatorio de la lista de amigos disponibles y lo asigna a `amigoSecreto`.
 */

/**
 * `Object.entries(objeto)`:
 * Método que devuelve un array de arrays, donde cada array interno es un par de clave-valor del objeto proporcionado. 
 * En el código, `Object.entries(resultado)` convierte el objeto `resultado` en un array de pares [amigo, amigoSecreto].
 */

/**
 * `.innerHTML`:
 * Propiedad utilizada para obtener o establecer el contenido HTML de un elemento. 
 * En este código, `ulResultado.innerHTML = ''` limpia el contenido de la lista de resultados antes de mostrar nuevos resultados.
 */

/**
 * `alert(mensaje)`:
 * Función que muestra una ventana emergente con el mensaje que se pasa como argumento. 
 * Ejemplo: `alert('Debe haber al menos dos amigos para sortear')` muestra una alerta cuando no hay suficientes amigos para el sorteo.
 */

/**
 * `forEach(func)`:
 * Método de arrays que ejecuta una función para cada elemento del array. 
 * En este código, `listaDeAmigos.forEach((amigo) => {...})` recorre cada amigo en la lista y les asigna un amigo secreto.
 */

/**
 * `let listaDeAmigos = []`:
 * Define una variable global llamada `listaDeAmigos` que almacena un array vacío al inicio. 
 * Este array se llena con los nombres de los amigos ingresados por el usuario y se utiliza en varias partes del código.
 */

/**
 * La siguiente línea de código filtra las palabras contenidas en la variable `palabrasFiltradas` 
 * para crear un nuevo array `nombres` que solo incluya aquellas palabras que estén presentes 
 * en uno de los dos arrays `nombresHombres` o `nombresMujeres`.
 *
 * 1. `palabrasFiltradas.filter(p => ...)`
 *    - `.filter()` es un método de los arrays en JavaScript que crea un nuevo array con los elementos 
 *      que pasan una prueba. En este caso, la prueba se define en la función de flecha `p => ...`, 
 *      donde `p` representa cada palabra del array `palabrasFiltradas`.
 *    - La función de flecha devuelve `true` o `false` dependiendo de si la palabra `p` debe ser 
 *      incluida en el nuevo array.
 *
 * 2. `busquedaBinaria(nombresHombres, p)`
 *    - `busquedaBinaria` es una función que implementa el algoritmo de búsqueda binaria. 
 *      La búsqueda binaria se usa para encontrar un elemento dentro de un array ordenado.
 *    - `nombresHombres` es un array que contiene los nombres de hombres, y `p` es la palabra 
 *      que estamos buscando dentro de `nombresHombres`.
 *    - Si `p` está presente en `nombresHombres`, la función `busquedaBinaria` devuelve `true`; 
 *      si no está, devuelve `false`.
 *
 * 3. `busquedaBinaria(nombresMujeres, p)`
 *    - De forma similar a la anterior, `busquedaBinaria` también se aplica al array `nombresMujeres`, 
 *      que contiene los nombres de mujeres. 
 *    - Si `p` está presente en `nombresMujeres`, la función devuelve `true`; si no, devuelve `false`.
 *
 * 4. `||` (Operador lógico OR)
 *    - El operador lógico `||` se usa para combinar dos expresiones booleanas. En este caso:
 *        - Si `busquedaBinaria(nombresHombres, p)` devuelve `true`, entonces `p` se incluirá en el 
 *          nuevo array `nombres`.
 *        - Si `busquedaBinaria(nombresHombres, p)` devuelve `false`, se evalúa 
 *          `busquedaBinaria(nombresMujeres, p)`. Si este segundo devuelve `true`, entonces también 
 *          `p` se incluirá en `nombres`.
 *    - En resumen, `p` se incluirá en el nuevo array si está presente en cualquiera de los dos arrays.
 *
 * 5. Resultado final
 *    - El resultado de esta operación es un nuevo array llamado `nombres`, que contiene las palabras 
 *      de `palabrasFiltradas` que están en cualquiera de los arrays `nombresHombres` o `nombresMujeres`.
 *    - Este proceso de filtrado asegura que solo se incluyan nombres que existan en las dos listas (hombres 
 *      o mujeres).
 * 3. ¿Por qué usar una letra como `p`?
 * - En JavaScript (y en muchos otros lenguajes), cuando estás escribiendo funciones de flecha, las letras cortas como `p`, `x`, `y`, o `item` se usan comúnmente para referirse a los parámetros de la función.
 * - En este caso, se usa `p` como una forma abreviada de "palabra" (o "parámetro") para representar el valor individual que se está evaluando dentro de la función. No es algo fijo, podríamos usar cualquier otra letra o palabra (como `nombre`, `elem`, `persona`), pero se elige una forma corta y comprensible.
 * 
 * 4. ¿Qué pasa con `p` dentro de la función de flecha?
 * - Dentro de la función de flecha, se evalúa si el nombre (representado por `p`) está presente en cualquiera de los dos arrays, `nombresHombres` o `nombresMujeres`, usando la función `busquedaBinaria`.
 * - El resultado de la función `busquedaBinaria(nombresHombres, p)` será `true` si `p` está en el array `nombresHombres`, y `false` en caso contrario. Lo mismo ocurre para `nombresMujeres`.
 * 
 * El valor de `p` decide si se incluye en el nuevo array:
 * - Si la búsqueda binaria devuelve `true` para alguno de los arrays, significa que el nombre (`p`) debe ser parte del nuevo array `nombres`, por lo que `p` será incluido.
 * 
 * Ejemplo paso a paso:
 * Supongamos que tienes los siguientes datos:
 * 
 * let palabrasFiltradas = ["Juan", "Ana", "Carlos", "Pedro"];
 * let nombresHombres = ["Juan", "Carlos", "Pedro"];
 * let nombresMujeres = ["Ana", "Maria"];
 * 
 * 1. Iteración 1:
 * - El primer valor de `p` es `"Juan"`, el cual es evaluado.
 * - Se evalúa `busquedaBinaria(nombresHombres, "Juan")` (esto devuelve `true` porque "Juan" está en `nombresHombres`).
 * - Como la condición se cumple (es `true`), `"Juan"` se incluye en el array `nombres`.
 * 
 * 2. Iteración 2:
 * - El siguiente valor de `p` es `"Ana"`.
 * - Se evalúa `busquedaBinaria(nombresHombres, "Ana")` (esto devuelve `false` porque "Ana" no está en `nombresHombres`).
 * - Luego, se evalúa `busquedaBinaria(nombresMujeres, "Ana")` (esto devuelve `true` porque "Ana" está en `nombresMujeres`).
 * - Como la condición se cumple (es `true`), `"Ana"` se incluye en el array `nombres`.
 * 
 * 3. Iteración 3:
 * - El siguiente valor de `p` es `"Carlos"`.
 * - Se evalúa `busquedaBinaria(nombresHombres, "Carlos")` (esto devuelve `true` porque "Carlos" está en `nombresHombres`).
 * - Como la condición se cumple (es `true`), `"Carlos"` se incluye en el array `nombres`.
 * 
 * 4. Iteración 4:
 * - El siguiente valor de `p` es `"Pedro"`.
 * - Se evalúa `busquedaBinaria(nombresHombres, "Pedro")` (esto devuelve `true` porque "Pedro" está en `nombresHombres`).
 * - Como la condición se cumple (es `true`), `"Pedro"` se incluye en el array `nombres`.
 * 
 * El resultado final de `nombres` sería:
 * 
 * nombres = ["Juan", "Ana", "Carlos", "Pedro"];
 * 
 * Resumen:
 * - `p` es simplemente el parámetro de la función de flecha que representa cada uno de los valores (nombres) del array `palabrasFiltradas` a medida que `.filter()` lo recorre.
 * - El uso de `p` es crucial porque es el valor que estamos evaluando para ver si debe ser incluido en el array final `nombres`, basándonos en si se encuentra en los arrays `nombresHombres` o `nombresMujeres`.
 
 * Ejemplo:
 *    Si `palabrasFiltradas = ["Juan", "Ana", "Carlos", "Pedro"]`, 
 *    `nombresHombres = ["Juan", "Carlos", "Pedro"]` y `nombresMujeres = ["Ana", "Maria"]`, 
 *    el array resultante `nombres` sería: `["Juan", "Ana", "Carlos"]`.
 */