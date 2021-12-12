const urlApi = 'http://localhost:8080/api/user';

$(document).ready(function () {
    bienvenida();
});

function bienvenida() {
    var usuario = sessionStorage.getItem("userName");
    $('#mensaje').html('<h1> Bienvenido Señor@' + usuario + '</h1>');

    listarTabla();
}

function listarTabla() {
    $.ajax({
        url: urlApi + '/all',
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            var valor = '';
            for (i = 0; i < response.length; i++) {
                valor += '<tr>' +
                    '<td>' + response[i].id + '</td>' +
                    '<td>' + response[i].identification + '</td>' +
                    '<td>' + response[i].name + '</td>' +
                    '<td>' + response[i].address + '</td>' +
                    '<td>' + response[i].cellPhone + '</td>' +
                    '<td>' + response[i].email + '</td>' +
                    '<td>' + response[i].password + '</td>' +
                    '<td>' + response[i].zone + '</td>' +
                    '<td>' + response[i].type + '</td>' +
                    '<td><button data-bs-toggle="modal" data-bs-target="#modelId" onclick="consultar(' + response[i].id + ')" class="btn btn-warning">Editar</button>' +
                    '<button onclick="borrar(' + response[i].id + ')" class="btn btn-danger">Eliminar</button></td>' +
                    '</tr>';
            }
            $('#tbody').html(valor);
        }
    });
}

function borrar(id) {
    var bool = confirm("Seguro de eliminar el registro?");
    if (bool) {
        $.ajax({
            url: urlApi + '/' + id,
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

function consultar(id) {
    $.ajax({
        url: urlApi + '/' + id,
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            $('#id').val(response.id);
            $('#name').val(response.name);
            $('#identification').val(response.identification);
            $('#cellPhone').val(response.cellPhone);
            $('#address').val(response.address);
            $('#email').val(response.email);
            $('#password').val(response.password);
            $('#password2').val(response.password);
            $('#zone').val(response.zone);
            $('#type').val(response.type);

            let valor = '<input class="btn form-control btn btn-warning" data-bs-dismiss="modal"  id="botonActualizar" type="submit" value="Actualizar" onclick="actualizar(' + id + ')">';
            $('#botonFormulario').html(valor);
            $("#botonRegistrar").remove();
        }
    });
}

function actualizar(idUsuario) {
    var dataForm = {
        id: idUsuario,
        identification: $("#identification").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cellPhone").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        zone: $("#zone").val(),
        type: $("#type").val()
    };

    var dataJson = JSON.stringify(dataForm);

    $.ajax({
        url: urlApi + '/update',
        type: 'PUT',
        data: dataJson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            alert('Usuario: ' + response.name + ' actualizazdo');
            limpiarFormulario();
            listarTabla();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al actualizar');
        }
    });
    let valor = '<input class="btn form-control btn btn-success"  id="botonRegistrar" type="submit" value="Registrar" onclick="validarFormulario()">';
    $('#botonFormulario').html(valor);
    $("#botonActualizar").remove();
}

function limpiarFormulario() {
    $('#formularioRegistro')[0].reset();
}
