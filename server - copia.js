'use strict';

const Hapi = require('hapi');
const MySQL = require('mysql');
const Joi = require('joi');
const Bcrypt = require('bcrypt');
const bodyparse = require('hapi-bodyparser');
const Agenda = require('agenda');
// Create a server with a host and port
const server = new Hapi.Server();

var status_jugada
var datos_carrera;
var ver_marca="actualizando";
var ver_tabla="actualizando";
var ver_puesto="actualizando";
var ver_matchop="actualizando";
var id_carrera=1;
var band_puesto=0;
var band_tabla=0;
var band_marca=0;
var band_matchop=0;

const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'hipismo'
});

var datos=0;


function status_opciones()
{  
    connection.query('select * from tstatus_opciones', (error,filas) => {
    if (error) {            
      console.log('error en el listado');
      return;
    }
     status_jugada=filas;
    console.log("status_opciones");
  });

}

function Puesto()

{     
    var sql="select tcaballos.Nro_caballo as nro, tcaballos.Nombre as caballo, cond_apuest_puest.condicion, tcaballos.Status as status_caballo from cond_apuest_puest inner join tcaballos where tcaballos.id=cond_apuest_puest.id_caballo and cond_apuest_puest.id_carrera="+ id_carrera+" order by nro asc";           
    connection.query(sql, (error,filas) => {
    if (error) {            
      console.log('error en el listado');
      return;
    }
    
     ver_puesto=filas;
    
  });

}

function Tabla()

{     
    var sql="select tcaballos.Nro_caballo as nro, tcaballos.Nombre as caballo, cond_apuest_tabl.precio, tcaballos.Status as status_caballo from cond_apuest_tabl inner join tcaballos where tcaballos.id=cond_apuest_tabl.id_caballo and cond_apuest_tabl.id_carrera="+ id_carrera+" order by nro asc";           
    connection.query(sql, (error,filas) => {
    if (error) {            
      console.log('error en el listado');
      return;
    }
    
     ver_tabla=filas;
    
  });

}

function Marca()

{     
    var sql="select tcaballos.Nro_caballo as Nro_caballo,  cond_apuest_marc.posicion from cond_apuest_marc inner join tcaballos where tcaballos.id=cond_apuest_marc.id_caballo and cond_apuest_marc.id_carrera="+ id_carrera+" order by posicion_aux asc";           
    connection.query(sql, (error,filas) => {
    if (error) {            
      console.log('error en el listado');
      return;
    }
    
     ver_marca=filas;
    
  });

}

function Matchop()

{     
    var sql="select cond_apuest_matchop.condi_A as A, cond_apuest_matchop.condi_B as B from cond_apuest_matchop where cond_apuest_matchop.id_carrera="+ id_carrera;           
    connection.query(sql, (error,filas) => {
    if (error) {            
      console.log('error en el listado');
      return;
    }
    
     ver_matchop=filas;
    
  });

}

function carreras()
{   var carrera = ("SELECT id_carrera, Nro_carrera, nombre, tcarreras.Status, monto_tabla FROM tcarreras inner join hipodromo where tcarreras.id_hipodromo = hipodromo.idhipodromo and tcarreras.Status='A'");      

    connection.query(carrera, (error,filas) => {
    if (error) {            
      console.log('error en el listado');
      return;
    }
    if(filas.length>0){
       
        datos_carrera=filas;
        id_carrera=datos_carrera[0].id_carrera;
    }
    else
    {
        datos_carrera[0].Status="T"
    }

  });
}





server.connection({
    host: 'localhost',
    port: 4100
});
connection.connect();

server.route({
    method: 'GET',
    path: '/helloworld',
    handler: function (request, reply) {
        return reply('hello world');
    }
});

// Add the route
server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, reply) {
        var consulta =  connection.query('SELECT * FROM hipodromo', function (error, results, fields) {
                if (error) throw error;

                });

           reply({
            statusCode: 200,
            message: 'Getting All User Data',
            data: [
                {
                    name:'Kashish',
                    age:24
                },
                {
                    name:'Shubham',
                    age:21
                },
                {
                    name:'Jasmine',
                    age:24
                },
                {
                    ejemplo: consulta
                }
            ]
        });         
    }
});




server.route({
    method: 'GET',
    path: '/visor',
    handler: function (request, reply) {
 // var carrera = ("SELECT id_carrera, Nro_carrera, nombre, tcarreras.Status, hipodromo.monto_tabla FROM tcarreras inner join hipodromo where tcarreras.id_hipodromo = hipodromo.idhipodromo and tcarreras.Status='A'");      
 // var status = ("SELECT id_carrera, Nro_carrera, nombre, tcarreras.Status FROM tcarreras inner join hipodromo where tcarreras.id_hipodromo = hipodromo.idhipodromo and tcarreras.Status='A'");      
  
  carreras();
    status_opciones();
  

      if (status_jugada[0].puesto==1 && band_puesto==0 && ver_puesto=="actualizando")
      {
        Puesto();
        band_puesto=1;
      }
      else if(status_jugada[0].puesto==2)
      {
        ver_puesto="actualizando";
        band_puesto=0;
      }

     if (status_jugada[0].tabla==1 && band_tabla==0 && ver_tabla=="actualizando")
      {
        Tabla();
        band_tabla=1;
      }
      else if(status_jugada[0].tabla==2)
      {
        ver_tabla="actualizando";
        band_tabla=0;
      }
    
    if (status_jugada[0].marca==1 && band_marca==0 && ver_marca=="actualizando")
      {
        Marca();
        band_marca=1;
      }
      else if(status_jugada[0].marca==2)
      {
        ver_marca="actualizando";
        band_marca=0;
      }

       if (status_jugada[0].machop==1 && band_matchop==0 && ver_matchop=="actualizando")
      {
        Matchop();
        band_matchop=1;
      }
      else if(status_jugada[0].machop==2)
      {
        ver_matchop="actualizando";
        band_matchop=0;
      }
  
  

   /* connection.query(carrera, function(err,row_carrera,fields){

     var sql=("SELECT * FROM hipodromo");
     var sql2=("SELECT * FROM tcaballos where id_carrera=4");

      connection.query(sql, function(err,rows,fields){
        
          connection.query(sql2, function(err, rows2, fields) 
           {

                 if (datos_carrera.length < 1)
                 {
                   reply({carrera: "actualizando" ,json1: rows, json2: rows2});  
                 }
                 else
                 {*/
                   reply({carrera: datos_carrera , puesto:ver_puesto, matchop:ver_matchop, tabla:ver_tabla, marca:ver_marca});    
                 //}
          //  })
     // })
  //});
  

    }
});


server.route({
    method: 'GET',
    path: '/user/{uid}',
    handler: function (request, reply) {
        const uid = request.params.uid;

        connection.query('SELECT uid, username, email FROM users WHERE uid = "' + uid + '"', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });

    },
    config: {
        validate: {
            params: {
                uid: Joi.number().integer()
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/auth/{username}/{password}',

    handler: function (request, reply) {
       
        const username = request.params.username;
        const password = request.params.password;
     
       /* var salt = Bcrypt.genSaltSync();
        var encryptedPassword = Bcrypt.hashSync(password, salt);
     
        var orgPassword = Bcrypt.compareSync(password, encryptedPassword);*/

        //connection.query('select INTO users (username,email,password) VALUES ("' + username + '","' + email + '","' + encryptedPassword + '")', function (error, results, fields) {
       
       connection.query('select * from usuario_view where usuario="' + username + '" and contraseña="' + password + '"', function (error, results, fields) {
      

            if (error) throw error;
            console.log(results);
            reply({message: "Bienvenido"});
        });

    
    }

});


server.route({
    method: 'POST',
    path: '/sendMessage',
    handler: function (request, reply) {

        const uid = request.payload.uid;
        const message = request.payload.message;
       
       reply(uid);

    },
    config: {
        validate: {
            payload: {
                uid: Joi.number().integer(),
                message: [Joi.string(), Joi.number()]
            }
        }

    }
});

server.route({
    method: 'POST',
    path: '/messages',

    handler: function (request, reply) {

        const uid = request.payload.uid;
        console.log(uid);

        connection.query('SELECT * FROM messages WHERE uid_fk = "' + uid + '"', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });

    },
    config: {
        validate: {
            payload: {
                uid: Joi.number().integer()
            }
        }

    }
});

server.route({
    method: 'DELETE',
    path: '/message/{uid}/{mid}',
    handler: function (request, reply) {
        const uid = request.params.uid;
        const mid = request.params.mid;

        console.log(uid + "---" + mid);

        connection.query('DELETE FROM messages WHERE uid_fk = "' + uid + '"AND mid = "' + mid + '"', function (error, result, fields) {
            if (error) throw error;

            if (result.affectedRows) {
                reply(true);
            } else {
                reply(false);
            }

        });
    },
    config: {
        validate: {
            params: {
                uid: Joi.number().integer(),
                mid: Joi.number().integer()
            }
        }

    }
});


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});