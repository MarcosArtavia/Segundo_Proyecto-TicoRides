
function login() {
    var user = document.getElementById('txtUser').value.trim();
    var pass = document.getElementById('txtPass').value.trim();
    var acceso = false;
    acceso = validateUser(user, pass);

    if (acceso) {
        location.href = "principal.html";
    }
    else {
        alert("Datos incorrectos");
    }

}


function validateInputsRegister() {
    var nombre = document.getElementById('txtNombre').value.trim();
    var apellidos = document.getElementById('txtApellidos').value.trim();
    var telefono = document.getElementById('txtTelefono').value.trim();
    var usuario = document.getElementById('txtUsuario').value.trim();
    var password = document.getElementById('txtPassword').value.trim();
    var repeatpass = document.getElementById('txtRepeatpass').value.trim();

    var newUser = {
        nombre: nombre,
        apellidos: apellidos,
        telefono: telefono,
        usuario: usuario,
        password: password,
        velocida: "",
        sobre_mi: ""
    };
    if (nombre == "" || apellidos == "" || telefono == "" || usuario == "" || password == "" || repeatpass == "") {
        alert("Ingrese todos los datos");
    }
    else if (validateUsername(usuario)) {
        alert("El nombre de usuario ya existe");
    }
    else {
        validatePassword(newUser, repeatpass);
    }
}

function validatePassword(object, repeatpass) {
    if (object.password == repeatpass) {
        insertList('users', object);
        insertSessionStorage('user', object.usuario);
        location.href = "principal.html";
    } else {
        alert("No coinciden las contraseñas");
    }
}

function validateUsername(user) {
    var userList = getList('users');
    var acceso = false;
    for (var i = 0; i < userList.length; i++) {
        if (user == userList[i].usuario) {
            acceso = true;
        }
    }
    return acceso;
}

function validateUser(user, password) {
    var userList = getList('users');
    var acceso = false;
    for (var i = 0; i < userList.length; i++) {
        if (user == userList[i].usuario && password == userList[i].password) {
            acceso = true;
            insertSessionStorage('user', userList[i].usuario);
        }
    }
    return acceso;
}

function loadNameUser() {
    var user = nameUser();
    var img = "<img src='img/user.png' width='40' height='40' alt='Usuario' />";
    jQuery("#btnUser").html(img + " " + user);
}

function loadAccount() {
    var user = nameUser();
    var list = getList('users');
    for (var i = 0; i < list.length; i++) {
        if (user == list[i].usuario) {
            jQuery("#inputName").val(list[i].nombre + " " + list[i].apellidos);
            jQuery("#inputVelocidad").val(list[i].velocida);
            jQuery("#sobre_mi").val(list[i].sobre_mi);
        }

    }
}

function saveAccount() {
    var name = document.getElementById('inputName').value.trim();
    var velocidad = document.getElementById('inputVelocidad').value.trim();
    var descripcion = document.getElementById('sobre_mi').value.trim();
    var cadena = name.split(" ");
    var user = nameUser();
    var list = getList('users');

    for (let i = 0; i < list.length; i++) {
        if (list[i].usuario == user) {
            if (cadena.length == 4) {
                list[i].nombre = cadena[0] + " " + cadena[1];
                list[i].apellidos = cadena[2] + " " + cadena[3];
            }
            else if (cadena.length == 3) {
                list[i].nombre = cadena[0];
                list[i].apellidos = cadena[1] + " " + cadena[2];
            }
            else if (cadena.length == 2) {
                list[i].nombre = cadena[0];
                list[i].apellidos = cadena[1];
            }
            else {
                alert("Ingrese el nombre completo");
            }
            list[i].velocida = velocidad;
            list[i].sobre_mi = descripcion;
            saveList('users', list);
            location.href = "principal.html";
        }

    }
}

function validateInputsRides() {
    var usuario = nameUser();
    var nombre = document.getElementById('inputName').value.trim();
    var origen = document.getElementById('inputOrigen').value.trim();
    var destino = document.getElementById('inputDestino').value.trim();
    var descripcion = document.getElementById('inputDescripcion').value.trim();
    var salida = document.getElementById('inputSalida').value.trim();
    var llegada = document.getElementById('inputLlegada').value.trim();
    var lunes = document.getElementById('chkLunes').checked;
    var martes = document.getElementById('chkMartes').checked;
    var miercoles = document.getElementById('chkMiercoles').checked;
    var jueves = document.getElementById('chkJueves').checked;
    var viernes = document.getElementById('chkViernes').checked;
    var sabado = document.getElementById('chkSabado').checked;
    var domingo = document.getElementById('chkDomingo').checked;


    var newRide = {
        usuario: usuario,
        nombre: nombre,
        origen: origen,
        destino: destino,
        descripcion: descripcion,
        salida: salida,
        llegada: llegada,
        lunes: lunes,
        martes: martes,
        miercoles: miercoles,
        jueves: jueves,
        viernes: viernes,
        sabado: sabado,
        domingo: domingo
    };
    if (nombre == "" || origen == "" || destino == "" || descripcion == "" || salida == "" || llegada == "" || validateDays(newRide)) {
        alert("Ingrese todos los datos");
    }
    else if (validateRideName(nombre, usuario)) {
        alert("El nombre del paseo ya existe");
    }
    else {
        insertList('rides', newRide);
        location.reload(true);
    }
}

function validateDays(ride) {
    var acceso = false;
    if (ride.lunes == false && ride.martes == false && ride.miercoles == false && ride.jueves == false && ride.viernes == false && ride.sabado == false && ride.domingo == false) {
        acceso = true;
    }
    return acceso;
}

function validateRideName(nombre, usuario) {
    var ridesList = getList('rides');
    var acceso = false;
    for (var i = 0; i < ridesList.length; i++) {
        if (nombre == ridesList[i].nombre && usuario == ridesList[i].usuario) {
            acceso = true;
        }
    }
    return acceso;
}

function loadUserRides() {
    var rides = getList('rides');
    var usuario = nameUser();
    if (rides.length == 0) {
        document.getElementById('table').style.display = "none";
    }
    else {
        loadTableRidesUser(usuario, rides);
    }
}

function loadTableRidesUser(usuario, object) {
    var table = jQuery('#table');
    var rows = "";
    object.forEach((ride, index) => {
        if (usuario == ride.usuario) {
            var row = `<tr><td>${ride.nombre}</td><td>${ride.origen}</td><td>${ride.destino}</td>`;
            row += `<td class='text-center'> <a data-toggle="modal" href="#editar" onclick="editRide(this)" data-id="${ride.id}" data-entity="table" class=" link edit" >Editar</a>  -  <a  onclick="deleteRide(this);" data-id="${ride.id}" data-entity="table" class="link delete">Eliminar</a>  </td>`;
            rows += row + '</tr>';
        }
    });
    if (!rows == "") {
        var rows = "<thead class='text-center'><tr><th scope='col'>Nombre</th><th scope='col'>Origen</th><th scope='col'>Destino</th><th scope='col'>Acciones</th></tr></thead>" + '<tbody>' + rows + '</tbody>';
        table.html(rows);
    }
    else {
        table.html(rows);
    }
}

function deleteRide(element) {
    var usuario = nameUser();
    var object = jQuery(element).data();
    var newObject = deleteFromTable('rides', object.id);
    loadTableRidesUser(usuario, newObject);
}

function editRide(element) {
    var object = jQuery(element).data();
    loadRide(object.id);
}

function loadRide(object) {
    desenmarcarChk();
    var list = getList('rides');
    for (var i = 0; i < list.length; i++) {
        if (object == list[i].id) {
            jQuery("#inputName").val(list[i].nombre);
            jQuery("#inputOrigen").val(list[i].origen);
            jQuery("#inputDestino").val(list[i].destino);
            jQuery("#inputDescripcion").val(list[i].descripcion);
            jQuery("#inputSalida").val(list[i].salida);
            jQuery("#inputLlegada").val(list[i].llegada);
            if (list[i].lunes == true) {
                jQuery("#chkLunes").prop('checked', true);
            }
            if (list[i].martes == true) {
                jQuery("#chkMartes").prop('checked', true);
            }
            if (list[i].miercoles == true) {
                jQuery("#chkMiercoles").prop('checked', true);
            }
            if (list[i].jueves == true) {
                jQuery("#chkJueves").prop('checked', true);
            }
            if (list[i].viernes == true) {
                jQuery("#chkViernes").prop('checked', true);
            }
            if (list[i].sabado == true) {
                jQuery("#chkSabado").prop('checked', true);
            }
            if (list[i].domingo == true) {
                jQuery("#chkDomingo").prop('checked', true);
            }
        }
    }
    sessionStorage.setItem('idRide', object);
}

function saveEditedRide() {
    var id = sessionStorage.getItem('idRide');
    var nombre = document.getElementById('inputName').value.trim();
    var origen = document.getElementById('inputOrigen').value.trim();
    var destino = document.getElementById('inputDestino').value.trim();
    var descripcion = document.getElementById('inputDescripcion').value.trim();
    var salida = document.getElementById('inputSalida').value.trim();
    var llegada = document.getElementById('inputLlegada').value.trim();
    var lunes = document.getElementById('chkLunes').checked;
    var martes = document.getElementById('chkMartes').checked;
    var miercoles = document.getElementById('chkMiercoles').checked;
    var jueves = document.getElementById('chkJueves').checked;
    var viernes = document.getElementById('chkViernes').checked;
    var sabado = document.getElementById('chkSabado').checked;
    var domingo = document.getElementById('chkDomingo').checked;


    var days = {
        lunes: lunes,
        martes: martes,
        miercoles: miercoles,
        jueves: jueves,
        viernes: viernes,
        sabado: sabado,
        domingo: domingo
    };
    if (nombre == "" || origen == "" || destino == "" || descripcion == "" || salida == "" || llegada == "" || validateDays(days)) {
        alert("Ingrese todos los datos");
    }
    else {
        var list = getList('rides');
        for (var i = 0; i < list.length; i++) {
            if (id == list[i].id) {
                list[i].nombre = nombre;
                list[i].origen = origen;
                list[i].destino = destino;
                list[i].descripcion = descripcion;
                list[i].salida = salida;
                list[i].llegada = llegada;
                list[i].lunes = lunes;
                list[i].martes = martes;
                list[i].miercoles = miercoles;
                list[i].jueves = jueves;
                list[i].viernes = viernes;
                list[i].sabado = sabado
                list[i].domingo = domingo;
            }
        }
        saveList('rides', list);
        location.reload(true);
    }
}

function searchRide() {
    var origen = document.getElementById('inputOrigen').value.trim();
    var destino = document.getElementById('inputDestino').value.trim();
    if (origen == "" || destino == "") {
        alert("Ingrese todos los datos");
    }
    else {
        loadTableRides(origen, destino);
    }
}

function loadTableRides(origen, destino) {
    var table = jQuery('#tableRides');
    var object = getList('rides');
    var rows = "";
    object.forEach((ride, index) => {
        if (ride.origen == origen && ride.destino == destino) {
            var row = `<tr><td>${ride.usuario}</td><td>${ride.origen}</td><td>${ride.destino}</td>`;
            row += `<td class='text-center'> <a data-toggle="modal" href="#verRide" onclick="verRide(this)" data-id="${ride.id}" data-entity="tableRides" class=" link ver" >Ver</a></td>`;
            rows += row + '</tr>';
        }
    });
    if (!rows == "") {
        var rows = "<thead class='text-center'><tr><th scope='col'>Usuario</th><th scope='col'>Origen</th><th scope='col'>Destino</th><th scope='col'></th></tr></thead>" + '<tbody>' + rows + '</tbody>';
        table.html(rows);
    }
    else {
        alert("No se encontraron paseos con ese origen y destino")
        table.html(rows);
    }
}

function verRide(element) {
    var object = jQuery(element).data();
    cargarRide(object.id);
}

function desenmarcarChk() {
    jQuery("#chkLunes").prop('checked', false);
    jQuery("#chkMartes").prop('checked', false);
    jQuery("#chkMiercoles").prop('checked', false);
    jQuery("#chkJueves").prop('checked', false);
    jQuery("#chkViernes").prop('checked', false);
    jQuery("#chkSabado").prop('checked', false);
    jQuery("#chkDomingo").prop('checked', false);

}

function cargarRide(object) {
    desenmarcarChk();
    var list = getList('rides');
    for (var i = 0; i < list.length; i++) {
        if (object == list[i].id) {
            jQuery("#inputName").val(list[i].nombre);
            jQuery("#inputUser").val(list[i].usuario);
            jQuery("#txtOrigen").val(list[i].origen);
            jQuery("#txtDestino").val(list[i].destino);
            jQuery("#inputDescripcion").val(list[i].descripcion);
            jQuery("#inputSalida").val(list[i].salida);
            jQuery("#inputLlegada").val(list[i].llegada);
            if (list[i].lunes == true) {
                jQuery("#chkLunes").prop('checked', true);
            }
            if (list[i].martes == true) {
                jQuery("#chkMartes").prop('checked', true);
            }
            if (list[i].miercoles == true) {
                jQuery("#chkMiercoles").prop('checked', true);
            }
            if (list[i].jueves == true) {
                jQuery("#chkJueves").prop('checked', true);
            }
            if (list[i].viernes == true) {
                jQuery("#chkViernes").prop('checked', true);
            }
            if (list[i].sabado == true) {
                jQuery("#chkSabado").prop('checked', true);
            }
            if (list[i].domingo == true) {
                jQuery("#chkDomingo").prop('checked', true);
            }
        }
    }
}

function bindEvents() {
    jQuery('#btnRegistrarme').bind('click', validateInputsRegister);
    jQuery('#btnIniciarSesion').bind('click', login);
    jQuery('#btnGuardarCambios').bind('click', saveAccount);
    jQuery('#btnGuardarRides').bind('click', validateInputsRides);
    jQuery('#btnGuardarRideE').bind('click', saveEditedRide);
    jQuery('#btnBuscarRide').bind('click', searchRide);
}

bindEvents();
