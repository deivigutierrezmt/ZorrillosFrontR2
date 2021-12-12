const urlApi = 'http://localhost:8080/api/fragance';

let mensaje = '';

$(document).ready(function () {
    listarTabla();
});

function listarTabla() {
    $.ajax({
        url: urlApi + '/all',
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            var valor = '';
            for (i = 0; i < response.length; i++) {
                valor += '<tr>' +
                    '<td>' + response[i].reference + '</td>' +
                    '<td>' + response[i].brand + '</td>' +
                    '<td>' + response[i].category + '</td>' +
                    '<td>' + response[i].presentation + '</td>' +
                    '<td>' + response[i].description + '</td>' +
                    '<td>' + response[i].price + '</td>' +
                    '<td>' + response[i].quantity + '</td>' +
                    '<td>' + response[i].photography + '</td>' +
                    '<td><button data-bs-toggle="modal" data-bs-target="#modelId" onclick="consultar(' + response[i].reference + ')" class="btn btn-warning">Editar</button>' +
                    `<button onclick="borrar(${response[i].reference})" class="btn btn-danger">Eliminar</button></td>` +
                    '</tr>';
            }
            $('#tbody').html(valor);
        }
    });
}


$("#formularioProducto").on("click", function (event) {
    event.preventDefault();
});

// validar datos del formulario
function validarFormulario() {
    if (validarDatos()) {
        registrarProducto(); // registrar producto
    } else {
        $('#alerta').html('<p id="mensaje">' + mensaje + '</p>'); //Mostrar alerta
    }
}

// Validar formulario
function validarDatos() {

    let referencia = $('#referencia').val();
    let marca = $('#brand').val();
    let categoria = $('#category').val();
    let presentacion = $('#presentation').val();
    let descripcion = $('#description').val();
    let precio = $('#price').val();
    let cantidad = $('#quantity').val();
    let foto = $('#photography').val();

    // validar campos vacios   
    if (referencia == '') {
        mensaje = 'Referencia es requerido ';
        return false;
    }
    if (marca == '') {
        mensaje = 'Marca es requerido ';
        return false;
    }
    if (categoria == '') {
        mensaje = 'Categoria es requerido ';
        return false;
    }
    if (presentacion == '') {
        mensaje = 'Presentacion es requerido ';
        return false;
    }
    if (descripcion == '') {
        mensaje = 'Descripción es requerido';
        return false;
    }
    if (precio == '') {
        mensaje = 'Precio es requerido';
        return false;
    }
    if (cantidad == '') {
        mensaje = 'Cantidad es requerido ';
        return false;
    }
    if (foto == '') {
        mensaje = 'Fotografia es requerido ';
        return false;
    }
    return true;
}

// Agregar nuevo producto
function registrarProducto() {
    var dataForm = {
        reference: $("#reference").val(),
        brand: $("#brand").val(),
        category: $("#category").val(),
        presentation: $("#presentation").val(),
        description: $("#description").val(),
        price: $("#price").val(),
        quantity: $("#quantity").val(),
        photography: $("#photography").val()
    };

    var dataJson = JSON.stringify(dataForm);

    $.ajax({
        url: urlApi + '/new',
        type: 'POST',
        data: dataJson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            listarTabla();
            alert('producto registrado');
            limpiarFormulario();
            $('#modelId').modal('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error al registrar');
        }
    });

}

function borrar(referenceId) {
    alert(referenceId);
    var bool = confirm("Seguro de borrar el registro?");
    if (bool) {
        $.ajax({
            url: urlApi + '/' + referenceId,
            type: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                alert("se elimino correctamente");
                listarTabla();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error');
            }
        });
    }
}

function consultar(referenceId) {
    $.ajax({
        url: urlApi + '/' + referenceId,
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            $("#reference").val(response.reference);
            $("#brand").val(response.brand);
            $("#category").val(response.category);
            $("#presentation").val(response.os);
            $("#description").val(response.description);
            $("#price").val(response.price);
            $("#quantity").val(response.quantity);
            $("#photography").val(response.photography);

            let valor = '<input class="btn form-control btn btn-warning" data-bs-dismiss="modal"  id="botonActualizar" type="submit" value="Actualizar" onclick="update(' + referenceId + ')">';
            $('#botonFormulario').html(valor);
            $("#botonRegistrar").remove();
        }
    });
}

function update(referenceId) {
    var dataForm = {
        reference: referenceId,
        brand: $("#brand").val(),
        category: $("#category").val(),
        presentation: $("#presentation").val(),
        description: $("#description").val(),
        price: $("#price").val(),
        quantity: $("#quantity").val(),
        photography: $("#photography").val()
    };

    var dataJson = JSON.stringify(dataForm);

    $.ajax({
        url: urlApi + '/update',
        type: 'PUT',
        data: dataJson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            alert('Producto: ' + response.brand + ' actualizazdo');
            limpiarFormulario();
            listarTabla();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al actualizar');
        }
    });

}

function limpiarFormulario() {
    $('#formularioProducto')[0].reset();

    let valor = '<input class="btn form-control btn btn-success"  id="botonRegistrar" type="submit" value="Registrar" onclick="validarFormulario()">';
    $('#botonFormulario').html(valor);
    $("#botonActualizar").remove();
}