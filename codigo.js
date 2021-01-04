function cargar() {
    var datos = {
        usuarios : [
            {nombre: "m", contraseña: "m", tipo: "maestro"},
            {nombre: "a", contraseña: "a", tipo: "aprendiz"},
            {nombre: "b", contraseña: "b", tipo: "aprendiz"},
            {nombre: "c", contraseña: "c", tipo: "aprendiz"},
            ],
        cuestiones : [
            {
                enunciado : "Cuestión completa",
                disponible : true,
                propuestasSolucion : [
                    {
                        propuesta : "propuesta 0 de solución",
                        correcta : true
                    },
                    {
                        propuesta : "propuesta 1 de solución incorrecta",
                        correcta : false,
                        error : "como no es correcta tiene que estar relleno"
                    }
                ],
                soluciones : [
                    {
                        texto : "texto solucion 0",
                        correcta : true,
                    },
                    {
                        texto : "texto solucion 1 no correcta",
                        correcta : false,
                        propuestasRazonamiento : [
                            {
                                propuesta : "propuesta 0 de razonamiento",
                                justificada : true
                            },
                            {
                                propuesta : "propuesta 1 de razonamiento no justificada",
                                justificada : false,
                                error : "como no está justificada tiene que existir"
                            }
                        ],
                        razonamientos : [
                            {
                                texto : "texto razonamiento 0",
                                justificado: true
                            },
                            {
                                texto : "texto razonamiento 1 no justificado",
                                justificado : false,
                                error : "como no está justificado tendrá q aparecer"
                            }
                        ]
                    }
                ]
            },
            {
                enunciado : "¿Qué es el Software?",
                disponible : true,
                soluciones : [
                    {
                        texto : "El software es la parte lógica de un sistema informático, o sea sin contemplar el hardware.",
                        correcta : false,
                        razonamientos : [
                            {
                                texto : "La definición es demasiado permisiva porque incluye firmware que no es software.",
                                justificado : false,
                                error : "El firmware sí es software pero con la característica de ser muy acoplado a algún dispositivo hardware."
                            },
                            {
                                texto: "La definición es demasiado permisiva porque los datos de usuario (todos los ficheros generados por el software), no son hardware ni son software y están siendo incluidos en el software.",
                                justificado: true
                                
                            }
                        ]
                    },
                    {
                        texto : "El software es la información que el desarrollador se suministra al hardware para posteriormente manipular la información del usuario.",
                        correcta : true
                    },
                    {
                        texto : "El software es el conjunto de los programas.",
                        correcta : false,
                        razonamientos : [
                            {
                                texto: "Porque no contempla los scripts de bases de datos (DDL, SQL), ficheros de configuración, imágenes (*.bmp, *.jpg, …) del interfaz gráfico de usuario, ficheros de datos (JSON, XML, DTD, XMLSchema, …), de publicación (HTML, CSS, …), … y otros artefactos necesarios en el software que no son para programar, son configurar, publicar, …",
                                justificado: true
                                
                            }
                        ]
                    }
                ]
            },
            {
                enunciado : "¿Qué es la recursividad?",
                disponible : true,
                soluciones : [
                    {
                        texto : "La característica de una función que se llama a sí misma.",
                        correcta : false,
                        razonamientos : [
                            {
                                texto : "La definición es demasiado restrictiva porque no contempla recursividad mutua.",
                                justificado: true
                            }
                        ]
                    },
                    {
                        texto : "La característica de una función que se llama a sí misma, directa o indirectamente a través de otras.",
                        correcta : false,
                        razonamientos : [
                            {
                                texto : "La definición es demasiado restrictiva porque no contempla recursividad de datos (para la definición de un árbol, grafo, …), de imágenes (fractales, …), …",
                                justificado: true
                            }
                        ]
                    },
                    {
                        texto : "La característica de algo que se define sobre sí mismo, directa o indirectamente.",
                        correcta : true
                    }
                ]
            }
        ]
    }
    window.localStorage.setItem("datos", JSON.stringify(datos));
    alert("Los datos han sido cargados. Es necesario tener conexión a internet para los CSS");
}

function validacion(){
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var usuario = document.getElementById("usuario").value;
    var contraseña = document.getElementById("contraseña").value;
    var usuario = getUsuario(datos, usuario, contraseña);
    if (usuario == null){
        login.action = "./login.html";
    } else {
        window.localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario.nombre));
        var login = document.getElementById("login");
        if (usuario.tipo == "maestro"){
            login.action = "./cuestionesMaestro.html";
        } else {
            login.action = "./cuestionesAprendiz.html";
        }
    }
    return usuario != null;
}

function getUsuario(datos, nombre, contraseña){
    for(usuario of datos.usuarios){
        if (usuario.nombre == nombre && usuario.contraseña == contraseña){
            return usuario;
        }
    }
    return null;
}

function agregarSolucion(){
    var textArea = document.getElementById("textoNuevaSolucion");
    var correcta = document.getElementById("CheckBoxCorrecta");
    
    if(textArea.value.trim() != ""){
        var solucion = formarSolucion(textArea.value, correcta.checked);
        var nuevoRazonamiento = solucion.getElementsByClassName("nuevoRazonamiento")[0];
        degradar(solucion);
        degradar(nuevoRazonamiento);
        var soluciones = document.getElementById("soluciones");
        soluciones.appendChild(solucion);
    
        textArea.value = "";
        correcta.checked = false;
    }
    else{
        alert("Por favor, introduzca una solución");
    }    
}

function formarSolucion(texto, correcta){
    var contenidoSolucion =
        '<label for="enunciado" class="h5">Solución</label>' +
        '<textarea rows="3" class="form-control">' + texto + '</textarea>' +
        '<div class="form-check mt-2">' +
            '<label class="form-check-label">' +
                '<input type="checkbox" class="form-check-input" onclick="solucionCorrectaIncorrecta(event)"' + checked(correcta) + '> Correcta' +
            '</label>' +
            '<button class="btn btn-danger pl-3 pr-3 ml-2" type="button" onclick="eliminarSolucionRazonamiento(event)">Eliminar solución</button>' +
        '</div>' +
        '<div class ="propuestasRazonamiento p-3 mb-2 mt-2 ml-5 bg-light border border-dark rounded" hidden>' +
            '<label for="propuestasRazonamiento" class="h5 mb-0">Propuestas de razonamiento</label>' +
        '</div>' +
        '<div class="razonamientos"></div>' +
        '<div class="nuevoRazonamiento ml-5 mt-2"' + hidden(correcta) + '>' +
            '<label for="enunciado" class="h5">Nuevo razonamiento</label>' +
            '<textarea rows="3" class="form-control"></textarea>' +
            '<div class="form-check mt-2">' +
                '<label class="form-check-label">' +
                    '<input type="checkbox" class="form-check-input" onclick="ocultarMostrarError(event)" checked> Justificado' +
                '</label>' +
                '<button class="btn btn-primary btn-sm pl-3 pr-3 ml-2" type="button" onclick="agregarRazonamiento(event)">Añadir razonamiento</button>' +
            '</div>' +
            '<div class="error" hidden>' +
                '<label for="error" class="h6">Error</label>' +
                '<textarea rows="2" class="form-control"></textarea>' +
                '<button class="btn btn-primary btn-sm pl-3 pr-3 mt-2" type="button" onclick="agregarRazonamiento(event)">Añadir razonamiento</button>' +
            '</div>' +
        '</div>';
    
    var solucion = document.createElement("div");
    solucion.className = "solucion mt-2";
    solucion.innerHTML = contenidoSolucion;
    return solucion;
}

function checked(correcta){
    if(correcta)
        return " checked";
    else
        return "";
}

function hidden(correcta){
    if(correcta)
        return " hidden";
    else
        return "";
}


function agregarRazonamiento(event){
    var nuevoRazonamiento = event.target.parentElement.parentElement;
    var textAreas = nuevoRazonamiento.getElementsByClassName("form-control");
    var justificado = nuevoRazonamiento.getElementsByClassName("form-check-input")[0];
    if(textAreas[0].value.trim() != "" && (justificado.checked || textAreas[1].value.trim() != "") ){
        //copio el nuevoRazonamiento y lo edito para convertirlo en razonamiento
        var razonamiento = nuevoRazonamiento.cloneNode(true);
        var label = razonamiento.getElementsByClassName("h5")[0];
        var botones = razonamiento.getElementsByClassName("btn");

        razonamiento.className = "razonamiento ml-5 mt-2";
        degradar(razonamiento);
        label.innerHTML = "Razonamiento";
        modificarBoton(botones[0]);
        modificarBoton(botones[1]);
        var solucion = nuevoRazonamiento.parentElement;
        var razonamientos = solucion.getElementsByClassName("razonamientos")[0];
        razonamientos.appendChild(razonamiento);

        //devuelvo NuevoRazonamiento a su estado inicial
        var error = nuevoRazonamiento.getElementsByClassName("error")[0];
        var boton = nuevoRazonamiento.getElementsByClassName("btn")[0];
        textAreas[0].value = "";
        textAreas[1].value = "";
        error.hidden = true;
        justificado.checked = true;
        boton.hidden = false;
    }
    else{
        if(textAreas[0].value.trim() == "")
            alert("Por favor, introduzca el razonamiento");
        else
            alert("Por favor, rellene el error");
    }
}

function degradar(elemento){
    if(!elemento.className.includes("degradadoDiv")){
        elemento.className += " degradadoDiv";
        var textArea = elemento.getElementsByClassName("form-control")[0];
        textArea.className = "form-control degradadoTextArea";
    }   
}

function modificarBoton(boton){
    boton.className = boton.className.replace("primary", "danger");
    boton.setAttribute("onclick", "eliminarSolucionRazonamiento(event)");
    boton.innerHTML = "Eliminar razonamiento";
}

function ocultarMostrarError(event){
    var checkBox = event.target;
    var boton = checkBox.parentElement.parentElement.getElementsByClassName("btn")[0];
    var tipo = checkBox.parentElement.parentElement.parentElement; //propuesta de solucion/razonamiento, razonamiento, nuevo razonamiento  
    var error = tipo.getElementsByClassName("error")[0];
    
    if(checkBox.checked){
        error.hidden = true;
        boton.hidden = false;
    }
    else{
        error.hidden = false;
        boton.hidden = true;
        degradar(error);
    }   
}

function solucionCorrectaIncorrecta(event){
    var checkBox = event.target;
    var solucion = checkBox.parentElement.parentElement.parentElement;
    var propuestasRazonamiento = solucion.getElementsByClassName("propuestasRazonamiento")[0];
    var razonamientos = solucion.getElementsByClassName("razonamientos")[0];
    var nuevoRazonamiento = solucion.getElementsByClassName("nuevoRazonamiento")[0];
    
    if(checkBox.checked){
        if(!propuestasRazonamiento.hidden){
            propuestasRazonamiento.hidden = true;
            alert("Aviso: se han eliminado las propuestas de razonamiento y los razonamientos de la solución");
        }
        else if (razonamientos.hasChildNodes()){
            alert("Aviso: se han eliminado los razonamientos de la solución");
        }
        razonamientos.innerHTML = "";
        nuevoRazonamiento.hidden = true;
    }
    else{
        nuevoRazonamiento.hidden = false;
        degradar(nuevoRazonamiento);
    }     
}

function corregir(event){
    var propuesta = event.target.parentElement.parentElement;
    var checkBox = propuesta.getElementsByClassName("form-check-input")[0];
    var textoError = propuesta.getElementsByClassName("form-control")[1];
    if(checkBox.checked || !checkBox.checked && textoError.value.trim() != ""){        
        var propuestas = propuesta.parentElement;
        propuestas.removeChild(propuesta);
        //Si no hay propuestas se oculta el container
        if(propuestas.childElementCount == 1){ //solo el label
            propuestas.hidden = true;
        }   
    }
    else{
        alert("Por favor, rellene el error");
    }
    
}

//misma lógica para borrar solución y razonamiento
function eliminarSolucionRazonamiento(event){
    var solucionRazonamiento = event.target.parentElement.parentElement;
    var solucionesRazonamientos = solucionRazonamiento.parentElement;
    solucionesRazonamientos.removeChild(solucionRazonamiento);
}

function cerrarCuestion(){
    var cuestion = {};
    cuestion.enunciado = document.getElementById("enunciado").value;
    if(cuestion.enunciado.trim() != ""){
        cuestion.disponible = document.getElementById("checkBoxDisponible").checked;
        var propuestasSolucion = document.getElementById("propuestasSolucion").getElementsByClassName("propuesta");
        var soluciones = document.getElementById("soluciones").getElementsByClassName("solucion");
        if(propuestasSolucion.length > 0){
            cuestion.propuestasSolucion = incluirPropuestasORazonamientos(propuestasSolucion, "deSolucion");
        }
        if(soluciones.length > 0){
            cuestion.soluciones = incluirSoluciones(soluciones);
        }

        var datos = JSON.parse(window.localStorage.getItem("datos"));
        var cuestionAbierta = JSON.parse(window.localStorage.getItem("cuestionAbierta"));
        if(cuestionAbierta >= 0){
            datos.cuestiones[cuestionAbierta] = cuestion;
        }
        else{
           datos.cuestiones.push(cuestion); 
        }
        window.localStorage.setItem("datos", JSON.stringify(datos));
        document.getElementById("formulario").action = "cuestionesMaestro.html";
    }
    else{
        alert("El enunciado de la cuestión está vacío.");
        document.getElementById("enunciado").focus();
        return false;
    }
}

function incluirPropuestasORazonamientos(propuestas, tipo){
    var array = [];
    for (let i = 0; i < propuestas.length; i++){
        var propuestaORazonamiento = {};
        var texto = propuestas[i].getElementsByClassName("form-control")[0].value;
        var checkBox = propuestas[i].getElementsByClassName("form-check-input")[0];
        if(tipo == "deSolucion"){
            propuestaORazonamiento.propuesta = texto;
            propuestaORazonamiento.correcta = checkBox.checked;
        }
        else if(tipo == "deRazonamiento"){
            propuestaORazonamiento.propuesta = texto;
            propuestaORazonamiento.justificada = checkBox.checked;
        }
        else{
            propuestaORazonamiento.texto = texto; 
            propuestaORazonamiento.justificado = checkBox.checked;
        }
        if (!checkBox.checked){
            var textoError = propuestas[i].getElementsByClassName("form-control")[1].value;
            propuestaORazonamiento.error = textoError;
        }
        array.push(propuestaORazonamiento);
    }
    return array;
}

function incluirSoluciones(soluciones){
    var arraySoluciones = [];
    for (let i = 0; i < soluciones.length; i++){
        var solucion = {};
        var texto = soluciones[i].getElementsByClassName("form-control")[0].value;
        var correcta = soluciones[i].getElementsByClassName("form-check-input")[0];
        solucion.texto = texto;
        solucion.correcta = correcta.checked;
        if(!correcta.checked){
            var propuestasRazonamiento = soluciones[i].getElementsByClassName("propuesta");
            var razonamientos = soluciones[i].getElementsByClassName("razonamiento");
            if(propuestasRazonamiento.length > 0){
                solucion.propuestasRazonamiento = incluirPropuestasORazonamientos(propuestasRazonamiento, "deRazonamiento");
            }
            if(razonamientos.length > 0){
                solucion.razonamientos = incluirPropuestasORazonamientos(razonamientos, "razonamientos");
            }
        }
        arraySoluciones.push(solucion);
    }
    return arraySoluciones;
}

function cargarCuestiones(deMaestro){
    var usuarioRegistrado = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
    document.getElementById("usuarioRegistrado").innerHTML = usuarioRegistrado;
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    if(datos.cuestiones.length > 0){
        var cuestiones = document.getElementById("cuestiones");
        for (let i = 0; i < datos.cuestiones.length; i++){
            if(deMaestro || !deMaestro && datos.cuestiones[i].disponible){
                var cuestion = formarCuestion(deMaestro, datos.cuestiones[i]);
                cuestiones.appendChild(cuestion);
            }
        }
    }
    else{
        document.getElementById("sinCuestiones").hidden = false;
        if(deMaestro)
            document.getElementById("leyenda").hidden = true;
    }
}

function formarCuestion(deMaestro, cuestion){
    var contenidoCuestion = 
        '<h3 class="mb-3">' + cuestion.enunciado + '</h3>' +
        '<a class="btn btn-primary pl-3 pr-3" role="button" ' + enlace(deMaestro) + 'onclick="almacenarNumCuestion(event)">Abrir</a>' +
        botonEliminar(deMaestro);
    var cuestionNodo = document.createElement("div");
    cuestionNodo.className = "cuestion container p-3 mb-4 border border-dark rounded";
    if(deMaestro && cuestion.disponible){
        cuestionNodo.className += " disponible";
    }
    else if(deMaestro && !cuestion.disponible){
        cuestionNodo.className += " noDisponible";
    }
    else{
        cuestionNodo.className += " bg-light";
    }
    cuestionNodo.innerHTML = contenidoCuestion;
    
    return cuestionNodo; 
}

function enlace(deMaestro){
    if(deMaestro){
        return 'href="cuestionAbierta.html"';
    } else{
        return 'href="cuestionAbiertaAprendiz.html"';
    }
}

function botonEliminar(deMaestro){
    if(deMaestro){
        return '<button class="btn btn-warning ml-1 pl-3 pr-3" type="button" onclick="eliminarCuestion(event)">Eliminar</button>';
    } else{
        return "";
    }
}

function eliminarCuestion(event){
    var cuestionesNodo = document.getElementById("cuestiones");
    var cuestion = event.target.parentElement;
    var enunciado = cuestion.getElementsByTagName("h3")[0].innerHTML;
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var numCuestion = getNumCuestion(enunciado, datos.cuestiones);
    datos.cuestiones.splice(numCuestion, 1); //borro del array
    cuestionesNodo.removeChild(cuestion);
    window.localStorage.setItem("datos", JSON.stringify(datos));
    if(datos.cuestiones.length == 0){
        document.getElementById("leyenda").hidden = true;
        document.getElementById("sinCuestiones").hidden = false;
    }
}

function cargarCuestion(){
    var cuestionAbierta = JSON.parse(window.localStorage.getItem("cuestionAbierta"));
    if(cuestionAbierta >= 0){
        var cuestion = JSON.parse(window.localStorage.getItem("datos")).cuestiones[cuestionAbierta];
        var enunciado = document.getElementById("enunciado");
        var disponible = document.getElementById("checkBoxDisponible");
        var propuestasSolucion = document.getElementById("propuestasSolucion");
        var soluciones = document.getElementById("soluciones");
        
        enunciado.value = cuestion.enunciado;
        disponible.checked = cuestion.disponible;
        if(cuestion.propuestasSolucion != null){
            for(let i = 0; i < cuestion.propuestasSolucion.length; i++){
                var propuestaSolucion = cargarPropuestaORazonamiento(cuestion.propuestasSolucion[i], "deSolucion");
                propuestasSolucion.appendChild(propuestaSolucion);
            }
            propuestasSolucion.hidden = false;
        }
        if(cuestion.soluciones != null){
           for(let i = 0; i < cuestion.soluciones.length; i++){
                var solucion = cargarSolucion(cuestion.soluciones[i]);
                soluciones.appendChild(solucion);
            } 
        }
    }
}
        
function cargarSolucion(solucion){
    var solucionNodo = formarSolucion(solucion.texto, solucion.correcta);
    if(!solucion.correcta){
        if(solucion.propuestasRazonamiento != null){
            var propuestasRazonamientoNodo = solucionNodo.getElementsByClassName("propuestasRazonamiento")[0];
            for(let i = 0; i < solucion.propuestasRazonamiento.length; i++){
                var propuestaRazonamiento = cargarPropuestaORazonamiento(solucion.propuestasRazonamiento[i], "deRazonamiento");
                propuestasRazonamientoNodo.appendChild(propuestaRazonamiento);
            }
            propuestasRazonamientoNodo.hidden = false;
        }
        if(solucion.razonamientos != null){
            var razonamientosNodo = solucionNodo.getElementsByClassName("razonamientos")[0];
            for(let i=0; i<solucion.razonamientos.length; i++){
                var razonamiento = cargarPropuestaORazonamiento(solucion.razonamientos[i], "razonamiento");
                razonamientosNodo.appendChild(razonamiento);
            }
        }
    }
    return solucionNodo;
}
        
function cargarPropuestaORazonamiento(propuestaORazonamiento, tipo){
    var contenido =
        label(tipo) +
        textArea(propuestaORazonamiento, tipo) +
        '<div class="form-check mt-2">' +
            '<label class="form-check-label">' +
                '<input type="checkbox" class="form-check-input" onclick="ocultarMostrarError(event)" ' + marcado(propuestaORazonamiento, tipo) + '> ' + checkBox(tipo) +
            '</label>' +
            boton(propuestaORazonamiento, tipo) +
        '</div>' +
        '<div class="error"' + ocultar(propuestaORazonamiento, tipo, false) + '>' +
            '<label for="error" class="h6">Error</label>' +
            '<textarea rows="2" class="form-control">' + textAreaError(propuestaORazonamiento) + '</textarea>' +
            botonError(tipo) +
        '</div>';
    var propuestaORazonamientoNodo = document.createElement("div");
    if(tipo == "razonamiento"){
        propuestaORazonamientoNodo.className = "razonamiento ml-5 mt-2";
    }
    else{
        propuestaORazonamientoNodo.className = "propuesta mt-3";
    }
    propuestaORazonamientoNodo.innerHTML = contenido;
    return propuestaORazonamientoNodo;
}

function label(tipo){
    if(tipo == "deSolucion"){
        return '<label for="propuestaSolucion" class="h6">Propuesta</label>';
    }
    else if (tipo == "deRazonamiento"){
        return '<label for="propuestaRazonamiento" class="h6">Propuesta</label>';
    }
    else{
        return '<label for="enunciado" class="h5">Razonamiento</label>';
    }
}

function textArea(propuestaORazonamiento, tipo){
    if(tipo == "razonamiento"){
        return '<textarea rows="3" class="form-control">' + propuestaORazonamiento.texto + '</textarea>';
    }
    else{
        return '<textarea rows="3" class="form-control" readonly>' + propuestaORazonamiento.propuesta + '</textarea>';
    }
}

function marcado(propuestaORazonamiento, tipo){
    if(tipo == "deSolucion"){
        var check = propuestaORazonamiento.correcta;
    }
    else if (tipo == "deRazonamiento"){
        var check = propuestaORazonamiento.justificada;
    }
    else{
        var check = propuestaORazonamiento.justificado;
    }
    if(check){
        return " checked";
    }
    else{
        return "";
    }
}

function checkBox(tipo){
    if(tipo == "deSolucion"){
        return 'Correcta';
    }
    else if (tipo == "deRazonamiento"){
        return 'Justificada';
    }
    else{
        return 'Justificado';
    }
}

function boton(propuestaORazonamiento, tipo){
    if(tipo == "razonamiento"){
        return '<button class="btn btn-danger btn-sm pl-3 pr-3 ml-2" type="button" onclick="eliminarSolucionRazonamiento(event)"' + ocultar(propuestaORazonamiento, tipo, true) + '>Eliminar razonamiento</button>';
    }
    else{
        return '<button class="btn btn-info pl-3 pr-3 ml-2" type="button" onclick="corregir(event)"' + ocultar(propuestaORazonamiento, tipo, true) + '>Corregir</button>';
    }
}

function botonError(tipo){
    if(tipo == "razonamiento"){
        return '<button class="btn btn-danger btn-sm pl-3 pr-3 mt-2" type="button" onclick="eliminarSolucionRazonamiento(event)">Eliminar razonamiento</button>';
    }
    else{
        return '<button class="btn btn-info pl-3 pr-3 mt-2" type="button" onclick="corregir(event)">Corregir</button>';
    }
}

function ocultar(propuestaORazonamiento, tipo, esBoton){
    if(tipo == "deSolucion"){
        var check = propuestaORazonamiento.correcta;
    }
    else if (tipo == "deRazonamiento"){
        var check = propuestaORazonamiento.justificada;
    }
    else{
        var check = propuestaORazonamiento.justificado;
    }
    if(check && !esBoton || !check && esBoton){
        return " hidden";
    }
    else{
        return "";
    }
}

function textAreaError(propuestaORazonamiento){
    if(propuestaORazonamiento.error != null){
        return propuestaORazonamiento.error;
    }
    else{
        return "";
    }
}

function almacenarNumCuestion(event){
    var numCuestion;
    if (event.target.innerHTML == "Abrir"){
        var cuestiones = JSON.parse(window.localStorage.getItem("datos")).cuestiones;
        var enunciado = event.target.parentElement.getElementsByTagName("h3")[0].innerHTML;
        numCuestion = getNumCuestion(enunciado, cuestiones);
    }
    else{
        numCuestion = "nueva";
    }
    window.localStorage.setItem("cuestionAbierta", JSON.stringify(numCuestion));
}

function getNumCuestion(enunciado, cuestiones){
    var pos = 0;
    while (enunciado != cuestiones[pos].enunciado){
        pos++; 
    }
    return pos;
}


/***********************LÓGICA APRENDIZ***********************/

function cargarCuestionAprendiz(){
    var cuestion = getCuestion();
    var enunciado = document.getElementById("enunciado");
    enunciado.value = cuestion.enunciado;
    if(cuestion.soluciones != null){
        var oculto = document.getElementById("oculto");
        //Inicializo el avance por las soluciones y razonamientos
        setAvance(-1, -1, -1);
        for(let i = 0; i < cuestion.soluciones.length; i++){
            var solucion = generarSolucion(cuestion.soluciones[i].texto);
            oculto.appendChild(solucion);
            if(!cuestion.soluciones[i].correcta){
                oculto.appendChild(generarPropuesta());
                if(cuestion.soluciones[i].razonamientos != null){
                    for(let j = 0; j < cuestion.soluciones[i].razonamientos.length; j++){
                        var razonamiento = generarRazonamiento(cuestion.soluciones[i].razonamientos[j].texto);
                        oculto.appendChild(razonamiento);
                    }
                }
            } 
        }
    }
}

function generarSolucion(enunciado){
    var contenido =
        '<label class="h5">Solución</label>' +
        '<textarea rows="3" class="form-control degradadoTextAreaAprendiz" readonly>' + enunciado + '</textarea>' +
        '<div class="form-check mt-2">' +
            '<label class="form-check-label">' +
                '<input type="checkbox" class="form-check-input"> Correcta' +
            '</label>' +
            '<a class="btn btn-primary pl-3 pr-3 ml-2" href="#fin" onclick="corregirAprendiz(event,true)">Corregir</a>' +
            '<label class="mensaje ml-1"></label>' +
        '</div>';
    var solucion = document.createElement("div");
    solucion.className = "solucion degradadoDiv";
    solucion.hidden = true;
    solucion.innerHTML = contenido;
    return solucion;
}

function generarRazonamiento(enunciado){
    var contenido =
        '<label class="h5">Razonamiento</label>' +
        '<textarea rows="3" class="form-control degradadoTextAreaAprendiz" readonly>' + enunciado + '</textarea>' +
        '<div class="form-check mt-2">' +
            '<label class="form-check-label">' +
                '<input type="checkbox" class="form-check-input"> Justificado' +
            '</label>' +
            '<a class="btn btn-primary pl-3 pr-3 ml-2" href="#fin" onclick="corregirAprendiz(event,false)">Corregir</a>' +
        '</div>' +
        '<label class="mensaje mt-1"></label>';
    var razonamiento = document.createElement("div");
    razonamiento.className = "razonamiento ml-5 degradadoDiv";
    razonamiento.hidden = true;
    razonamiento.innerHTML = contenido;
    return razonamiento;
}

function generarPropuesta(){
    var contenido =
        '<label class="h5">Propuesta de razonamiento</label>' +
        '<textarea rows="3" class="form-control degradadoTextArea"></textarea>' +
        '<div class="mt-2">' +
            '<a class="btn btn-info pl-3 pr-3" href="#fin" onclick="enviarRazonamiento(event)">Enviar</a>' +
            '<label class="mensaje ml-1"></label>' +
        '</div>';
    var propuestaRazonamiento = document.createElement("div");
    propuestaRazonamiento.className = "propuestaRazonamiento ml-5 degradadoDiv";
    propuestaRazonamiento.hidden = true;
    propuestaRazonamiento.innerHTML = contenido;
    return propuestaRazonamiento;
}

function getCuestion(){
    var cuestionAbierta = JSON.parse(window.localStorage.getItem("cuestionAbierta"));
    var cuestion = JSON.parse(window.localStorage.getItem("datos")).cuestiones[cuestionAbierta];
    return cuestion;
}

function setAvance(solucion, razonamiento, elemento){
    var avance = {solucionActual : solucion, razonamientoActual : razonamiento, elementoActual : elemento};
    window.localStorage.setItem("avance", JSON.stringify(avance));
}

function getAvance(){
    return JSON.parse(window.localStorage.getItem("avance"));
}

function enviarSolucion(event){
    var solucionNodo = event.target.parentElement.parentElement;
    var texto = getTexto(solucionNodo);
    if(texto.trim() != ""){
        var datos = JSON.parse(window.localStorage.getItem("datos"));
        var cuestionAbierta = JSON.parse(window.localStorage.getItem("cuestionAbierta"));
        var cuestion = datos.cuestiones[cuestionAbierta];
        var propuestaSolucion = {propuesta : texto, correcta: true};
        if(cuestion.propuestasSolucion == null){
            cuestion.propuestasSolucion = [];
        }
        cuestion.propuestasSolucion.push(propuestaSolucion);
        datos.cuestiones[cuestionAbierta] = cuestion;
        window.localStorage.setItem("datos", JSON.stringify(datos));
        setMensaje(solucionNodo, "Propuesta enviada para su corrección", "info");
        desactivar(solucionNodo);
        mostrarSiguiente();
    }
    else{
        alert("Por favor, introduzca la propuesta.");
    }
}

function enviarRazonamiento(event){
    var razonamientoNodo = event.target.parentElement.parentElement;
    var texto = getTexto(razonamientoNodo);
    if(texto.trim() != ""){
        var datos = JSON.parse(window.localStorage.getItem("datos"));
        var cuestionAbierta = JSON.parse(window.localStorage.getItem("cuestionAbierta"));
        var avance = getAvance();
        var cuestion = datos.cuestiones[cuestionAbierta];
        var propuestaRazonamiento = {propuesta: texto, justificada: true};
        if(cuestion.soluciones[avance.solucionActual].propuestasRazonamiento == null){
            cuestion.soluciones[avance.solucionActual].propuestasRazonamiento = [];
        }
        cuestion.soluciones[avance.solucionActual].propuestasRazonamiento.push(propuestaRazonamiento);
        datos.cuestiones[cuestionAbierta] = cuestion;
        window.localStorage.setItem("datos", JSON.stringify(datos));
        setMensaje(razonamientoNodo, "Propuesta enviada para su corrección", "info");
        desactivar(razonamientoNodo);
        mostrarSiguiente();
    }
    else{
        alert("Por favor, introduzca la respuesta.");
    }
}

function corregirAprendiz(event, esSolucion){
    var solucionORazonamiento = event.target.parentElement.parentElement;
    var texto = getTexto(solucionORazonamiento);
    if(texto.trim() != ""){
        var datos = JSON.parse(window.localStorage.getItem("datos"));
        var cuestionAbierta = JSON.parse(window.localStorage.getItem("cuestionAbierta"));
        var cuestion = datos.cuestiones[cuestionAbierta];
        var checkBox = solucionORazonamiento.getElementsByClassName("form-check-input")[0];
        var avance = getAvance();
        if(esSolucion){
            var correcta = cuestion.soluciones[avance.solucionActual].correcta;
            if(checkBox.checked == correcta)
                setMensaje(solucionORazonamiento, "Respuesta correcta", "acierto");
            else
                setMensaje(solucionORazonamiento, "Respuesta incorrecta", "fallo");
        }
        else{ //es razonamiento
            var razonamiento = cuestion.soluciones[avance.solucionActual].razonamientos[avance.razonamientoActual];
            if(checkBox.checked == razonamiento.justificado)
                setMensaje(solucionORazonamiento, "Respuesta correcta", "acierto");
            else if(razonamiento.error != null){
                setMensaje(solucionORazonamiento, "No está justificado porque: " + razonamiento.error, "fallo");
            }else
                setMensaje(solucionORazonamiento, "Respuesta incorrecta", "fallo");
        }
        desactivar(solucionORazonamiento);
        mostrarSiguiente();
    }
    else{
        alert("Por favor, introduzca la respuesta.");
    }
}

function desactivar(elemento){
    elemento.getElementsByClassName("form-control")[0].readOnly = true;
    elemento.getElementsByClassName("btn")[0].disabled = true;
    var checkBox = elemento.getElementsByClassName("form-check-input")[0];
    if(checkBox != null)
        checkBox.disabled = true;   
}

function getTexto(elemento){
    return elemento.getElementsByClassName("form-control")[0].value;
}

function setMensaje(elemento, mensaje, tipo){
    var label = elemento.getElementsByClassName("mensaje")[0];
    label.innerHTML = mensaje;
    if(tipo == "info")
        label.className += " alert alert-primary";
    else if (tipo == "acierto")
        label.className += " alert alert-success";
    else
        label.className += " alert alert-danger";
}

function mostrarSiguiente(){
    var elementos = document.getElementById("oculto").childNodes;
    var avance = getAvance();
    var finCuestion = document.getElementById("finCuestion");
    var siguiente = avance.elementoActual + 1;
    if(siguiente < elementos.length){
        elementos[siguiente].hidden = false;
        finCuestion.focus();
        var tipo = getTipo(elementos[siguiente]);
        if(tipo == "solucion")
            setAvance(avance.solucionActual+1, -1, siguiente);
        else if(tipo == "razonamiento")
            setAvance(avance.solucionActual, avance.razonamientoActual+1, siguiente);
        else
            setAvance(avance.solucionActual, avance.razonamientoActual, siguiente);
    }
    else{
        finCuestion.hidden = false;
        finCuestion.className += " parpadeo"
    }
}

function getTipo(elemento){
    //alert("tipo del siguiente elemento: "+elemento.className.substring(0, elemento.className.indexOf(" ")));
    return elemento.className.substring(0, elemento.className.indexOf(" "));
}