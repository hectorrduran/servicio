'use strict';

const Hapi = require('hapi');
const MySQL = require('mysql');
const Joi = require('joi');
//const Bcrypt = require('bcrypt');
const bodyparse = require('hapi-bodyparser');
const Agenda = require('agenda');
// Create a server with a host and port
const server = new Hapi.Server();

var status_jugada;
var datos_carrera;
var ver_marca="actualizando";
var ver_tabla="actualizando";
var ver_puesto="actualizando";
var ver_matchop="actualizando";
var id_carrera=1;
var Nro_carrera=0;
var Carrera_activa="I";
var band_puesto=0;
var band_tabla=0;
var band_marca=0;
var band_matchop=0;

var mensaje="nada";




var datos=0;


var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    }
  }
});

var port = process.env.port || 8080;
server.connection({port: port});

function status_opciones()
{  
    connection.query('select * from tstatus_opciones', (error,filas) => {
    if (error) {            
      console.log('error en el listado');
      return;
    }
     status_jugada=filas;
    
  });

}

function Puesto()

{     
    var sql="select  tcaballos.id ,tcaballos.Nro_caballo as nro, tcaballos.Nombre as caballo, cond_apuest_puest.condicion, tcaballos.Status as status_caballo from cond_apuest_puest inner join tcaballos where tcaballos.id=cond_apuest_puest.id_caballo and cond_apuest_puest.id_carrera="+ id_carrera+" order by nro asc";           
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
    var sql="select tcaballos.id, tcaballos.Nro_caballo as nro, tcaballos.Nombre as caballo, cond_apuest_tabl.precio, tcaballos.Status as status_caballo from cond_apuest_tabl inner join tcaballos where tcaballos.id=cond_apuest_tabl.id_caballo and cond_apuest_tabl.id_carrera="+ id_carrera+" order by nro asc";           
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
        Nro_carrera=datos_carrera[0].Nro_carrera;
        Carrera_activa=datos_carrera[0].Status;
    }
    else
    {
        datos_carrera[0].Status="T"
        Carrera_activa="T";
    }
     
  });
}


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
        ver_matchop="no visible";
        band_matchop=0;
      }
  
       reply({carrera: datos_carrera , puesto:ver_puesto, matchop:ver_matchop, tabla:ver_tabla, marca:ver_marca});    
       
    }
});

server.route({
    method: 'GET',
    path: '/puesto',
    handler: function (request, reply) {
      if(status_jugada[0].puesto==1)
       reply({carrera: datos_carrera, puesto:ver_puesto});    
      else
      {
        reply({carrera: "Actualizando jugadas"});
      }
    }
});

server.route({
    method: 'GET',
    path: '/tabla',
    handler: function (request, reply) {
    if(status_jugada[0].tabla==1)
       reply({carrera: datos_carrera, tabla:ver_tabla});    
    else
      {
        reply({carrera: "Actualizando jugadas"});
      }
    }
});


server.route({
    method: 'GET',
    path: '/obtener_ticket_puesto/{ticket}',
    handler: function (request, reply) {

   var puesto = "SELECT a.Puesto, a.Caballo, a.Carrera , a.Monto, a.Usuario, datediff(CURRENT_TIMESTAMP, a.fecha) as dias, b.Status_pago FROM tjugadas_puesto as a, tcarreras as b where a.Ticket="+request.params.ticket+" and a.Status='A' and a.Carrera=b.id_carrera LIMIT 1";

   connection.query(puesto, function (error, results, fields) {
       if (error) throw error;
          if(results.length>0)
          {
            console.log(results[0].Carrera); 
            console.log(results[0].Caballo);
           connection.query('SELECT Nro_llegada FROM tposicion where id_carrera='+results[0].Carrera+' and id_Caballo='+results[0].Caballo+' LIMIT 1', function (error, arrival_horse, fields) {
              if (error) throw error;
               if (arrival_horse.length==0)
               {
                arrival_horse=0;
               }
               else
               {
                arrival_horse=arrival_horse[0].Nro_llegada;
               }
                connection.query('SELECT count(*) as cantidad FROM tcaballos where id_carrera='+results[0].Carrera+' and status="A" limit 6', function (error, count_horse, fields) {
                 if (error) throw error;
                   console.log(count_horse);
                    console.log(arrival_horse);
                    reply({message:"Existe",horse:results, arrival:arrival_horse, count:count_horse, activo:status_jugada[0].puesto});
                })
            })
          }
          else
          {
             reply({message:"No existe"});
          }
        });

    }
});

server.route({
    method: 'GET',
    path: '/obtener_ticket_tabla/{ticket}',
    handler: function (request, reply) {

   var puesto = "SELECT  a.precio, a.Caballo, a.carrera as Carrera, a.canti_juga, datediff( CURRENT_TIMESTAMP , a.fecha ) as dias, a.usuario, b.Status_pago FROM tjugadas_tabla as a, tcarreras as b where a.Ticket="+request.params.ticket+" and a.Status='A' and a.Carrera=b.id_carrera LIMIT 1";
   var monto_tabla=340;
   var monto=0;
      connection.query(puesto, function (error, results, fields) {
       if (error) throw error;
          if(results.length>0)
          {
        
           connection.query('SELECT Nro_llegada FROM tposicion where id_carrera='+results[0].Carrera+' and id_Caballo='+results[0].Caballo+' LIMIT 1', function (error, arrival_horse, fields) {
              if (error) throw error;
               if (arrival_horse.length==0)
               {
                arrival_horse=0;
               }
               else
               {
                arrival_horse=arrival_horse[0].Nro_llegada;
               }
               console.log("1");
                connection.query('SELECT count(*) as cantidad FROM tcaballos where id_carrera='+results[0].Carrera+' and status="A" limit 6', function (error, count_horse, fields) {
                 if (error) throw error;
                   console.log("2");
                    connection.query('SELECT ifnull(SUM(precio),0) as total FROM cond_apuest_tabl where id_carrera='+results[0].Carrera+' and Status="R" limit 25', function (error, monto_retirado, fields) {
                         if (error) throw error;
                          if (monto_retirado.length>0)
                          { 
                           monto = monto_retirado[0].total - (monto_retirado[0].total*0.66);
                           monto = (monto_tabla - monto_retirado[0].total) + monto;
                          }
                          else
                          {
                            monto=monto_tabla;
                          }
                             console.log("3");
                        connection.query('SELECT ifnull(SUM(Nro_llegada),0) as total FROM tposicion where id_carrera='+results[0].Carrera+' and Nro_llegada = 1 limit 2', function (error, empate, fields) {
                         if (error) throw error;
                         
                         if (empate.length>0)
                         {
                            console.log("4");
                            monto=monto/empate[0].total;
                         }
                           
                           reply({message:"Existe",horse:results, arrival:arrival_horse, count:count_horse, monto_table:monto, activo:status_jugada[0].tabla});
                        })
                  })
                })
            })
          }
          else
          {
             reply({message:"No existe"});
          }
        });

    }
});

server.route({
    method: 'GET',
    path: '/obtener_ticket_marca/{ticket}',
    handler: function (request, reply) {
 
   var marca = 'SELECT ifnull(a.usuario,0) as usuario, datediff( CURRENT_TIMESTAMP , a.fecha ) as dias, a.monto, a.carrera, a.caballoF, a.caballoC, b.Status_pago FROM tjugadas_marca as a, tcarreras as b where a.ticket='+request.params.ticket+' and a.Status="A" and a.carrera=b.id_carrera limit 1';
   console.log(marca);
   var monto=0;
   var ganador="perdedor";
   connection.query(marca, function (error, results, fields) {
       if (error) throw error;
          if(results.length>0)
          {
        
           connection.query('SELECT Nro_llegada, id_Caballo FROM tposicion where id_carrera='+results[0].carrera+' and id_Caballo='+results[0].caballoC+' or id_Caballo='+results[0].caballoF+' LIMIT 2', function (error, arrival_horse, fields) {
              if (error) throw error;
               if (arrival_horse.length>1)
               {
                if(arrival_horse[0].id_Caballo==results[0].caballoF)
                {
                   if(arrival_horse[0].Nro_llegada<arrival_horse[1].Nro_llegada)
                   {
                        ganador="ganador";
                   }
                } 
                else
                {
                    if(arrival_horse[1].Nro_llegada<arrival_horse[0].Nro_llegada)
                   {
                        ganador="ganador";
                   }
                   else
                   {
                     if(arrival_horse[1].Nro_llegada==arrival_horse[0].Nro_llegada)
                         ganador="empate";
                   }
                }
               }
               else
               {
                ganador="invalido";
               }

               reply({message:"Existe",horse:results, arrival:ganador, activo:status_jugada[0].marca});
        
            })
          }
          else
          {
             reply({message:"No existe"});
          }
        });

    }
});


server.route({
    method: 'GET',
    path: '/insert_win_puesto/{user}/{carrera}/{ticket}/{monto}',
    handler: function (request, reply) {

        connection.beginTransaction(function(err) {
          if (err) { reply({message:"Transaction Incomplete"}); }
                      connection.query('Update tjugadas_puesto set Status="P" where ticket=?', request.params.ticket, function(err, result) {
         
                      if (err) { 
              connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
              });
            }
         
          //  var log = result.insertId;
           var sql = 'Insert into tticketpagadopuesto (Usuario, carrera, Ticket, Monto, Fecha) values ('+request.params.user+','+request.params.carrera+','+request.params.ticket+','+request.params.monto+', CURRENT_TIMESTAMP)';
           console.log(sql);

           connection.query(sql, function(err, result) {

          if (err) { 
                connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
                });
              }  
              connection.commit(function(err) {
                if (err) { 
                  connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
                  });
                }
               
                reply({message:"Transaction Complete"});
               
              });
            });
          });
        });
     }
});


server.route({
    method: 'GET',
    path: '/insert_win_tabla/{user}/{carrera}/{ticket}/{monto}',
    handler: function (request, reply) {

        connection.beginTransaction(function(err) {
          if (err) { reply({message:"Transaction Incomplete"}); }
                      connection.query('Update tjugadas_tabla set status="P" where ticket=?', request.params.ticket, function(err, result) {
         
                      if (err) { 
              connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
              });
            }
         
          //  var log = result.insertId;
           var sql = 'Insert into tticketpagadotabla (usuario, carrera, Ticket, Monto, Fecha) values ('+request.params.user+','+request.params.carrera+','+request.params.ticket+','+request.params.monto+', CURRENT_TIMESTAMP)';
           console.log(sql);

           connection.query(sql, function(err, result) {

          if (err) { 
                connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
                });
              }  
              connection.commit(function(err) {
                if (err) { 
                  connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
                  });
                }
               
                reply({message:"Transaction Complete"});
               
              });
            });
          });
        });
     }
});

server.route({
    method: 'GET',
    path: '/insert_win_marca/{user}/{carrera}/{ticket}/{monto}',
    handler: function (request, reply) {

        connection.beginTransaction(function(err) {
          if (err) { reply({message:"Transaction Incomplete"}); }
                      connection.query('Update tjugadas_marca set Status="P" where ticket=?', request.params.ticket, function(err, result) {
         
                      if (err) { 
              connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
              });
            }
         
          //  var log = result.insertId;
           var sql = 'Insert into tticketpagadomarca (usuario, carrera, Ticket, Monto, Fecha) values ('+request.params.user+','+request.params.carrera+','+request.params.ticket+','+request.params.monto+', CURRENT_TIMESTAMP)';
           console.log(sql);

           connection.query(sql, function(err, result) {

          if (err) { 
                connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
                });
              }  
              connection.commit(function(err) {
                if (err) { 
                  connection.rollback(function() {
                     reply({message:"Transaction Incomplete"});
                  });
                }
               
                reply({message:"Transaction Complete"});
               
              });
            });
          });
        });
     }
});


server.route({
    method: 'GET',
    path: '/load_taquilla/{centro}/{usuario}',
    handler: function (request, reply) {
    
         
   connection.query('select id as Id, nombre as Nombre from usuario where id_centro='+request.params.centro+' and id!='+request.params.usuario
, function (error, loadTaquilla, fields) {
       if (error)  throw error;
                 reply({message:"Exitoso",taquillas:loadTaquilla});
         })
        }
      });

      server.route({
        method: 'GET',
        path: '/load_hipodromo',
        handler: function (request, reply) {             
        connection.query('select idhipodromo as Id, nombre as Nombre from hipodromo', function (error, loadHipodromo, fields) {
           if (error)  throw error;
                     reply({message:"Exitoso",hipodromo:loadHipodromo});
             })
            }
          });

    server.route({
    method: 'GET',
    path: '/load_carreras_hipodromo/{id}/{fecha}',
    handler: function (request, reply) {             
    connection.query('select id_carrera as Id, Nro_carrera as Nombre from tcarreras where id_hipodromo='+request.params.id+' and Date(Fecha)=DATE("'+request.params.fecha+'")', function (error, loadCerreraHipodromo, fields) {
        if (error)  throw error;

        if(loadCerreraHipodromo.length>0)
       {
         reply({message:"Exitoso",lista:loadCerreraHipodromo});
       }
       else{
        reply({message:"No hay Carreras definidadas en la fecha",lista:loadCerreraHipodromo});
       }
            })
        }
    });
              
      server.route({
        method: 'GET',
        path: '/horse_retirado/{id}',
        handler: function (request, reply) {
        
             
       connection.query('SELECT Status FROM tcaballos WHERE id='+request.params.id+' limit 1'
    , function (error, Status_horse, fields) {
           if (error) throw error;
                  
                     reply({status:Status_horse[0].Status});
                               
                    
             })
            }
          });
    
    

server.route({
    method: 'GET',
    path: '/balance_taquilla/{fecha}/{user}',
    handler: function (request, reply) {
    
         
   connection.query('select ifnull(c.Monto,0) as montoPuesto, ifnull(c.total,0) as totalPuesto, ifnull(v.total2,0) as totalTabla, ifnull(v.Monto2,0) as montoTabla, ifnull(m.MontoM,0) as montoMarca, ifnull(m.totalM,0) as totalMarca from usuario a left join (select usuario, sum(Monto) as Monto, count(*) as total from tjugadas_puesto where Date(fecha)=DATE("'+request.params.fecha+'") and Usuario='+request.params.user+') c on c.Usuario=a.id left join (select Usuario, sum(precio*canti_juga) as Monto2, count(*) as total2 from tjugadas_tabla where Date(fecha)=DATE("'+request.params.fecha+'") and usuario='+request.params.user+') v on v.usuario=a.id left join (select usuario, ifnull(sum(monto),0) as MontoM, count(*) as totalM from tjugadas_marca where Date(fecha)=DATE("'+request.params.fecha+'") and usuario='+request.params.user+') m on m.usuario=a.id where a.id='+request.params.user+''
, function (error, ticketsJ, fields) {
       if (error) throw error;
            connection.query('select ifnull(c.Monto,0) as montoPuesto, ifnull(c.total,0) as totalPuesto, ifnull(v.total2,0) as totalTabla, ifnull(v.Monto2,0) as montoTabla, ifnull(m.MontoM,0) as montoMarca, ifnull(m.totalM,0) as totalMarca from usuario a left join (select Usuario, ifnull(sum(Monto),0) as Monto, count(*) as total from tticketpagadopuesto where Date(fecha)=DATE("'+request.params.fecha+'") and Usuario='+request.params.user+') c on c.Usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as Monto2, count(*) as total2 from tticketpagadotabla where Date(fecha)=DATE("'+request.params.fecha+'") and usuario='+request.params.user+') v on v.usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as MontoM, count(*) as totalM from tticketpagadomarca where Date(fecha)=DATE("'+request.params.fecha+'") and usuario='+request.params.user+') m on m.usuario=a.id where a.id='+request.params.user+''
, function (error, ticketP, fields) {
              if (error) throw error;
               
                reply({ticketsJugados:ticketsJ, ticketsPagados:ticketP});
                
         })
      });

    }
});


server.route({
    method: 'GET',
    path: '/balance_taquilla_carrera/{fecha}/{user}/{carrera}',
    handler: function (request, reply) {
        console.log('select ifnull(c.Monto,0) as montoPuesto, ifnull(c.total,0) as totalPuesto, ifnull(v.total2,0) as totalTabla, ifnull(v.Monto2,0) as montoTabla, ifnull(m.MontoM,0) as montoMarca, ifnull(m.totalM,0) as totalMarca from usuario a left join (select usuario, sum(Monto) as Monto, count(*) as total from tjugadas_puesto where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and Usuario='+request.params.user+') c on c.Usuario=a.id left join (select Usuario, sum(precio*canti_juga) as Monto2, count(*) as total2 from tjugadas_tabla where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and usuario='+request.params.user+') v on v.usuario=a.id left join (select usuario, ifnull(sum(monto),0) as MontoM, count(*) as totalM from tjugadas_marca where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and usuario='+request.params.user+') m on m.usuario=a.id where a.id='+request.params.user+'');
 connection.query('select ifnull(c.Monto,0) as montoPuesto, ifnull(c.total,0) as totalPuesto, ifnull(v.total2,0) as totalTabla, ifnull(v.Monto2,0) as montoTabla, ifnull(m.MontoM,0) as montoMarca, ifnull(m.totalM,0) as totalMarca from usuario a left join (select usuario, sum(Monto) as Monto, count(*) as total from tjugadas_puesto where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and Usuario='+request.params.user+') c on c.Usuario=a.id left join (select Usuario, sum(precio*canti_juga) as Monto2, count(*) as total2 from tjugadas_tabla where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and usuario='+request.params.user+') v on v.usuario=a.id left join (select usuario, ifnull(sum(monto),0) as MontoM, count(*) as totalM from tjugadas_marca where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and usuario='+request.params.user+') m on m.usuario=a.id where a.id='+request.params.user+''
, function (error, ticketsJ, fields) {
       if (error) throw error;
            connection.query('select ifnull(c.Monto,0) as montoPuesto, ifnull(c.total,0) as totalPuesto, ifnull(v.total2,0) as totalTabla, ifnull(v.Monto2,0) as montoTabla, ifnull(m.MontoM,0) as montoMarca, ifnull(m.totalM,0) as totalMarca from usuario a left join (select Usuario, ifnull(sum(Monto),0) as Monto, count(*) as total from tticketpagadopuesto where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and Usuario='+request.params.user+') c on c.Usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as Monto2, count(*) as total2 from tticketpagadotabla where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and usuario='+request.params.user+') v on v.usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as MontoM, count(*) as totalM from tticketpagadomarca where Date(fecha)=DATE("'+request.params.fecha+'") and carrera='+request.params.carrera+' and usuario='+request.params.user+') m on m.usuario=a.id where a.id='+request.params.user+''
, function (error, ticketP, fields) {
              if (error) throw error;
               
                reply({ticketsJugados:ticketsJ, ticketsPagados:ticketP});
                
         })
      });

    }
});

server.route({
    method: 'GET',
    path: '/detener_jugada/{jugada}',
    handler: function (request, reply) {

    connection.query('Update tstatus_opciones set '+request.params.jugada+'=2 where id=1'
, function (error, ticketP, fields) {
              if (error) throw error;
                   reply({message:"Exitoso"});
             
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_pago_tabla/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
    connection.query('SELECT tjugadas_tabla.ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_tabla.canti_juga, tjugadas_tabla.precio, tcarreras.Nro_carrera, tjugadas_tabla.status, ifnull(tticketpagadotabla.Monto,0) as Monto,  tjugadas_tabla.fecha, ifnull(tticketpagadotabla.Fecha, "0") as fechap FROM tticketpagadotabla inner join tjugadas_tabla on tticketpagadotabla.Ticket=tjugadas_tabla.Ticket inner join tcaballos on tjugadas_tabla.Caballo=tcaballos.id inner join tcarreras on tjugadas_tabla.carrera=tcarreras.id_carrera  where tticketpagadotabla.usuario='+request.params.taquilla+' and Date(tticketpagadotabla.Fecha)>=DATE("'+request.params.desde+'") and Date(tticketpagadotabla.Fecha)<=DATE("'+request.params.hasta+'") order by ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_pago_puesto/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
       
    connection.query('SELECT tjugadas_puesto.Ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_puesto.Puesto, tjugadas_puesto.Monto, tjugadas_puesto.Status, ifnull(tticketpagadopuesto.Monto,0) as Monto_pagado, tjugadas_puesto.Fecha, ifnull(tticketpagadopuesto.Fecha,"0") as fechaP FROM tticketpagadopuesto inner join tjugadas_puesto on tticketpagadopuesto.Ticket=tjugadas_puesto.Ticket inner join tcaballos on tjugadas_puesto.Caballo=tcaballos.id  where tticketpagadopuesto.Usuario='+request.params.taquilla+' and Date(tticketpagadopuesto.Fecha)>=DATE("'+request.params.desde+'") and Date(tticketpagadopuesto.Fecha)<=DATE("'+request.params.hasta+'") order by Ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_pago_marca/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
       
    connection.query('SELECT tjugadas_marca.ticket, tjugadas_marca.cf, tjugadas_marca.cc, ifnull(tjugadas_marca.monto,0) as Monto, tjugadas_marca.Status, ifnull(tticketpagadomarca.Monto,0) as Monto_pagado, tjugadas_marca.fecha, ifnull(tticketpagadomarca.Fecha,"0") as fechaP  FROM tticketpagadomarca inner join tjugadas_marca on tticketpagadomarca.Ticket=tjugadas_marca.ticket where tticketpagadomarca.usuario='+request.params.taquilla+' and Date(tticketpagadomarca.Fecha)>=DATE("'+request.params.desde+'") and Date(tticketpagadomarca.Fecha)<=DATE("'+request.params.hasta+'") order by Ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_general_tabla/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
       
    connection.query('SELECT tjugadas_tabla.ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_tabla.canti_juga, tjugadas_tabla.precio, tcarreras.Nro_carrera, tjugadas_tabla.status, ifnull(tticketpagadotabla.Monto,0) as Monto_pagado,  tjugadas_tabla.fecha, ifnull(tticketpagadotabla.Fecha, "0") as fechap FROM tjugadas_tabla inner join tcaballos on tjugadas_tabla.Caballo=tcaballos.id inner join tcarreras on tjugadas_tabla.carrera=tcarreras.id_carrera left join tticketpagadotabla on  tjugadas_tabla.Ticket=tticketpagadotabla.Ticket where tjugadas_tabla.usuario='+request.params.taquilla+' and Date(tjugadas_tabla.fecha)>=DATE("'+request.params.desde+'") and Date(tjugadas_tabla.fecha)<=DATE("'+request.params.hasta+'") order by ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_general_puesto/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
       
    connection.query('SELECT tjugadas_puesto.Ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_puesto.Puesto, tjugadas_puesto.Monto, tjugadas_puesto.Status, ifnull(tticketpagadopuesto.Monto,0) as Monto_pagado, tjugadas_puesto.Fecha, ifnull(tticketpagadopuesto.Fecha,"0") as fechaP  FROM tjugadas_puesto inner join tcaballos on tjugadas_puesto.Caballo=tcaballos.id left join tticketpagadopuesto on tjugadas_puesto.Ticket=tticketpagadopuesto.Ticket  where tjugadas_puesto.usuario='+request.params.taquilla+' and Date(tjugadas_puesto.fecha)>=DATE("'+request.params.desde+'") and Date(tjugadas_puesto.fecha)<=DATE("'+request.params.hasta+'") order by Ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_general_marca/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
       
    connection.query('SELECT tjugadas_marca.ticket, tjugadas_marca.cf, tjugadas_marca.cc, ifnull(tjugadas_marca.monto,0) as Monto, tjugadas_marca.Status, ifnull(tticketpagadomarca.Monto,0) as Monto_pagado, tjugadas_marca.fecha, ifnull(tticketpagadomarca.Fecha,"0") as fechaP  FROM tjugadas_marca left join tticketpagadomarca on tjugadas_marca.ticket=tticketpagadomarca.Ticket where tjugadas_marca.usuario='+request.params.taquilla+' and Date(tjugadas_marca.fecha)>=DATE("'+request.params.desde+'") and Date(tjugadas_marca.fecha)<=DATE("'+request.params.hasta+'") order by ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});


server.route({
    method: 'GET',
    path: '/reporte_carrera_marca/{desde}/{taquilla}/{carrera}',
    handler: function (request, reply) {
       
    connection.query('SELECT tjugadas_marca.ticket, tjugadas_marca.cf, tjugadas_marca.cc, ifnull(tjugadas_marca.monto,0) as Monto, tjugadas_marca.Status, ifnull(tticketpagadomarca.Monto,0) as Monto_pagado, tjugadas_marca.fecha, ifnull(tticketpagadomarca.Fecha,"0") as fechaP  FROM tjugadas_marca left join tticketpagadomarca on tjugadas_marca.ticket=tticketpagadomarca.Ticket where tjugadas_marca.usuario='+request.params.taquilla+' and Date(tjugadas_marca.fecha)=DATE("'+request.params.desde+'") and tjugadas_marca.carrera='+request.params.carrera+' order by ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_carrera_puesto/{desde}/{taquilla}/{carrera}',
    handler: function (request, reply) {
       
    connection.query('SELECT tjugadas_puesto.Ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_puesto.Puesto, tjugadas_puesto.Monto, tjugadas_puesto.Status, ifnull(tticketpagadopuesto.Monto,0) as Monto_pagado, tjugadas_puesto.Fecha, ifnull(tticketpagadopuesto.Fecha,"0") as fechaP  FROM tjugadas_puesto inner join tcaballos on tjugadas_puesto.Caballo=tcaballos.id left join tticketpagadopuesto on tjugadas_puesto.Ticket=tticketpagadopuesto.Ticket  where tjugadas_puesto.Usuario='+request.params.taquilla+' and Date(tjugadas_puesto.Fecha)=DATE("'+request.params.desde+'") and tjugadas_puesto.Carrera='+request.params.carrera+' order by Ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});

server.route({
    method: 'GET',
    path: '/reporte_carrera_tabla/{desde}/{taquilla}/{carrera}',
    handler: function (request, reply) {
       console.log('SELECT tjugadas_tabla.ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_tabla.canti_juga, tjugadas_tabla.precio, tcarreras.Nro_carrera, tjugadas_tabla.status, ifnull(tticketpagadotabla.Monto,0) as Monto_pagado,  tjugadas_tabla.fecha, ifnull(tticketpagadotabla.Fecha, "0") as fechap FROM tjugadas_tabla inner join tcaballos on tjugadas_tabla.Caballo=tcaballos.id inner join tcarreras on tjugadas_tabla.carrera=tcarreras.id_carrera left join tticketpagadotabla on  tjugadas_tabla.Ticket=tticketpagadotabla.Ticket where tjugadas_tabla.usuario='+request.params.taquilla+' and Date(tjugadas_tabla.fecha)=DATE("'+request.params.desde+'") and tjugadas_tabla.carrera='+request.params.carrera+' order by ticket desc');
    connection.query('SELECT tjugadas_tabla.ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_tabla.canti_juga, tjugadas_tabla.precio, tcarreras.Nro_carrera, tjugadas_tabla.status, ifnull(tticketpagadotabla.Monto,0) as Monto_pagado,  tjugadas_tabla.fecha, ifnull(tticketpagadotabla.Fecha, "0") as fechap FROM tjugadas_tabla inner join tcaballos on tjugadas_tabla.Caballo=tcaballos.id inner join tcarreras on tjugadas_tabla.carrera=tcarreras.id_carrera left join tticketpagadotabla on  tjugadas_tabla.Ticket=tticketpagadotabla.Ticket where tjugadas_tabla.usuario='+request.params.taquilla+' and Date(tjugadas_tabla.fecha)=DATE("'+request.params.desde+'") and tjugadas_tabla.carrera='+request.params.carrera+' order by ticket desc'
, function (error, ticketP, fields) {
              if (error) throw error;
               if(ticketP.length>0)
                reply({message:"Exitoso",ticketsPagados:ticketP});
               else
               reply({message:"No existen pagos para el rango de fecha"});
      });

    }
});


server.route({
    method: 'GET',
    path: '/balance_taquilla_admin/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
    
         
   connection.query('select ifnull(c.Monto,0) as montoPuesto, ifnull(c.total,0) as totalPuesto, ifnull(v.total2,0) as totalTabla, ifnull(v.Monto2,0) as montoTabla, ifnull(m.MontoM,0) as montoMarca, ifnull(m.totalM,0) as totalMarca from usuario a left join (select usuario, sum(Monto) as Monto, count(*) as total from tjugadas_puesto where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and Usuario='+request.params.taquilla+') c on c.Usuario=a.id left join (select Usuario, sum(precio*canti_juga) as Monto2, count(*) as total2 from tjugadas_tabla where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and usuario='+request.params.taquilla+') v on v.usuario=a.id left join (select usuario, ifnull(sum(monto),0) as MontoM, count(*) as totalM from tjugadas_marca where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and usuario='+request.params.taquilla+') m on m.usuario=a.id where a.id='+request.params.taquilla+''
, function (error, ticketsJ, fields) {
       if (error) throw error;
            connection.query('select ifnull(c.Monto,0) as montoPuesto, ifnull(c.total,0) as totalPuesto, ifnull(v.total2,0) as totalTabla, ifnull(v.Monto2,0) as montoTabla, ifnull(m.MontoM,0) as montoMarca, ifnull(m.totalM,0) as totalMarca from usuario a left join (select Usuario, ifnull(sum(Monto),0) as Monto, count(*) as total from tticketpagadopuesto where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and Usuario='+request.params.taquilla+') c on c.Usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as Monto2, count(*) as total2 from tticketpagadotabla where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and usuario='+request.params.taquilla+') v on v.usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as MontoM, count(*) as totalM from tticketpagadomarca where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and usuario='+request.params.taquilla+') m on m.usuario=a.id where a.id='+request.params.taquilla+''
, function (error, ticketP, fields) {
              if (error) throw error;
               
                reply({ticketsJugados:ticketsJ, ticketsPagados:ticketP});
                
         })
      });

    }
});

server.route({
    method: 'GET',
    path: '/balance_general_admin/{desde}/{hasta}/{taquilla}',
    handler: function (request, reply) {
    
         connection.query('select ifnull(SUM(c.Monto),0) as montoPuesto, ifnull(SUM(c.total),0) as totalPuesto, ifnull(SUM(v.total2),0) as totalTabla, ifnull(SUM(v.Monto2),0) as montoTabla, ifnull(SUM(m.MontoM),0) as montoMarca, ifnull(SUM(m.totalM),0) as totalMarca from usuario a left join (select usuario, sum(Monto) as Monto, count(*) as total from tjugadas_puesto where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and ('+request.params.taquilla+')) c on c.Usuario=a.id left join (select Usuario, sum(precio*canti_juga) as Monto2, count(*) as total2 from tjugadas_tabla where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and ('+request.params.taquilla+')) v on v.usuario=a.id left join (select usuario, ifnull(sum(monto),0) as MontoM, count(*) as totalM from tjugadas_marca where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and ('+request.params.taquilla+')) m on m.usuario=a.id'
, function (error, ticketsJ, fields) {
       if (error) throw error;
            connection.query('select ifnull(SUM(c.Monto),0) as montoPuesto, ifnull(SUM(c.total),0) as totalPuesto, ifnull(SUM(v.total2),0) as totalTabla, ifnull(SUM(v.Monto2),0) as montoTabla, ifnull(SUM(m.MontoM),0) as montoMarca, ifnull(SUM(m.totalM),0) as totalMarca from usuario a left join (select Usuario, ifnull(sum(Monto),0) as Monto, count(*) as total from tticketpagadopuesto where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and ('+request.params.taquilla+')) c on c.Usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as Monto2, count(*) as total2 from tticketpagadotabla where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and ('+request.params.taquilla+')) v on v.usuario=a.id left join (select usuario, ifnull(sum(Monto),0) as MontoM, count(*) as totalM from tticketpagadomarca where Date(fecha)>=DATE("'+request.params.desde+'") and Date(fecha)<=DATE("'+request.params.hasta+'") and ('+request.params.taquilla+')) m on m.usuario=a.id'
, function (error, ticketP, fields) {
              if (error) throw error;
               
                reply({ticketsJugados:ticketsJ, ticketsPagados:ticketP});
                
         })
      });

    }
});


server.route({
    method: 'GET',
    path: '/marca_f/{id}',
    handler: function (request, reply) {
   
    var query = 'select id, Nro_caballo as nro FROM view_cond_caballo_marca WHERE posicion_aux<(select ifnull(SUM(posicion_aux),25)  from view_cond_caballo_marca where id='+request.params.id+') order by posicion_aux limit 16';
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
         reply({marca:results});
      });
    
  }

});
server.route({
    method: 'GET',
    path: '/marca_i',
    handler: function (request, reply) {
    if(status_jugada[0].marca==1)
    {
   var query = "SELECT sql_cache aux_caballos_marca.id, aux_caballos_marca.Nro_caballo as nro, tcarreras.id_carrera, tcarreras.Nro_carrera FROM aux_caballos_marca inner join tcarreras on tcarreras.id_carrera=aux_caballos_marca.id_carrera and aux_caballos_marca.Status='A' and tcarreras.Status='A' order by Nro_caballo limit 20";
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
         reply({carrera: datos_carrera, marca:results});
      });
    }
    else
      {
        reply({carrera: "Actualizando jugadas"});
      }

    }
});



server.route({
    method: 'GET',
    path: '/jugadas_tabla/{fecha}/{user}',
    handler: function (request, reply) {
   
   var query = 'SELECT tjugadas_tabla.ticket as Ticket, tcaballos.Nro_caballo, tcaballos.Nombre as info_caballo, tjugadas_tabla.canti_juga as cantidad, tjugadas_tabla.precio as Precio, tcarreras.Nro_carrera as Carrera, tcarreras.id_hipodromo FROM tjugadas_tabla inner join tcaballos on tjugadas_tabla.Caballo=tcaballos.id inner join tcarreras on tjugadas_tabla.carrera=tcarreras.id_carrera where Date(tjugadas_tabla.Fecha)=DATE("'+request.params.fecha+'") and tjugadas_tabla.usuario='+request.params.user+' order by ticket desc ';
    
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       if(results.length>0)   {
        connection.query('select nombre from hipodromo where idhipodromo ='+results[0].id_hipodromo, function (error, hipodromo, fields) {
           if (error) throw error;

             reply({message:"Exitoso",tabla:results, hipodromos:hipodromo[0].nombre});

            });
        }
        else
        reply({message:"No existen registro"});
          });
        }
    });


    server.route({
        method: 'GET',
        path: '/visor_admin',
        handler: function (request, reply) {
       
       var query = 'SELECT `jugada`, sum(`monto`) as cantidad FROM marca_jugada_aux GROUP BY `jugada` ORDER BY monto DESC';
       var query2='select c.Nro_caballo, c.Nombre, a.PUesto as jugada, SUM(a.Monto) as cantidad from puesto_jugada_aux as a, cond_apuest_puest as b, tcaballos as c where a.Puesto=b.condicion and a.carrera=b.id_carrera and a.caballo=b.id_caballo and c.id=b.id_caballo GROUP BY a.Puesto ORDER BY monto DESC';
       var query3='select c.Nro_caballo, c.Nombre, a.precio as jugada, SUM(a.canti_juga) as cantidad from tabla_jugada_aux as a, cond_apuest_tabl as b, tcaballos as c where a.precio=b.precio and a.carrera=b.id_carrera and a.caballo=b.id_caballo and c.id=b.id_caballo GROUP BY a.Precio ORDER BY a.canti_juga DESC';
        
       connection.query(query, function (error, TotalMarca, fields) {
           if (error) throw error;
          
            connection.query(query2, function (error, TotalPuesto, fields) {
               if (error) throw error;
               connection.query(query3, function (error, TotalTabla, fields) {
                if (error) throw error;
                 reply({message:"Exitoso",marca:TotalMarca, puesto:TotalPuesto, tabla:TotalTabla});
    
                });
                });
              });
            }
        });
    


server.route({
    method: 'GET',
    path: '/jugadas_marca/{fecha}/{user}',
    handler: function (request, reply) {
   
   var query = 'SELECT tjugadas_marca.ticket as Ticket, tjugadas_marca.cf as CaballoF, tjugadas_marca.cc as CaballoC, tjugadas_marca.monto as Monto, tcarreras.Nro_carrera as Carrera, tcarreras.id_hipodromo FROM tjugadas_marca inner join tcarreras on tjugadas_marca.carrera=tcarreras.id_carrera where Date(tjugadas_marca.fecha)=DATE("'+request.params.fecha+'") and tjugadas_marca.usuario='+request.params.user+' order by tjugadas_marca.ticket desc';
    
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       if(results.length>0)   {
        connection.query('select nombre from hipodromo where idhipodromo ='+results[0].id_hipodromo, function (error, hipodromo, fields) {
           if (error) throw error;

             reply({message:"Exitoso",marca:results, hipodromos:hipodromo[0].nombre});

            });
        }
        else
        reply({message:"No existen registro"});
          });
        }
    });

server.route({
    method: 'GET',
    path: '/jugadas_puesto/{fecha}/{user}',
    handler: function (request, reply) {
   
   var query = 'SELECT tjugadas_puesto.Ticket, tcaballos.Nro_caballo, tcaballos.Nombre, tjugadas_puesto.Puesto, tjugadas_puesto.Monto, tcarreras.Nro_carrera, tcarreras.id_hipodromo, tjugadas_puesto.Fecha FROM tjugadas_puesto inner join tcaballos on tjugadas_puesto.Caballo=tcaballos.id inner join tcarreras on tjugadas_puesto.Carrera=tcarreras.id_carrera where Date(tjugadas_puesto.Fecha)=DATE("'+request.params.fecha+'") and tjugadas_puesto.usuario='+request.params.user+' order by Fecha desc';
    
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       if(results.length>0)   {
        connection.query('select nombre from hipodromo where idhipodromo ='+results[0].id_hipodromo, function (error, hipodromo, fields) {
           if (error) throw error;
          
             reply({message:"Exitoso",puesto:results, hipodromos:hipodromo[0].nombre});
          
       });
    }
    else
    reply({message:"No existen registro"});
      });
    }
});

server.route({
    method: 'POST',
    path: '/insert_marca',
    handler: function (request, reply) {

var query = 'Insert into tjugadas_marca (ticket, usuario, caballoF, caballoC, carrera, monto, fecha, cf, cc) values (' + request.payload.ticket + ', ' + request.payload.usuario + ', ' + request.payload.caballoF + ',  ' + request.payload.caballoC + ', ' + request.payload.carrera + ',' + request.payload.monto + ', CURRENT_TIMESTAMP, ' + request.payload.cf + ',' + request.payload.cc + ')';
var query_verify='select ifnull((select posicion_aux from cond_apuest_marc where id_carrera=' + request.payload.carrera + ' and id_caballo=' + request.payload.caballoF + '),10) as cf, ifnull((select posicion_aux from cond_apuest_marc where id_carrera=' + request.payload.carrera + ' and id_caballo=' + request.payload.caballoC + '),10) as cc'

 if(status_jugada[0].marca==1 && datos_carrera[0].id_carrera==request.payload.carrera && datos_carrera[0].Status=="A")
    {
      connection.query(query_verify, function (error, results, fields) {
       if (error) reply({Message: "Error al ingresar jugada intente de nuevo"}); ;
       if(results[0].cf>results[0].cc && results[0].cf!=results[0].cc)
       {
    connection.query(query, function (error, results, fields) {
       if (error) throw error;

       if (results.affectedRows) {
                reply({Message: "Ingresado Correctamente"}); 
            } else {
                reply({Message: "Error al ingresar jugada intente de nuevo"}); 
            }
             
      });
    }
        else
        {
             reply({Message: "Jugada actualizada intenete de nuevo"});
        }
     });
    }
    else
    {
         reply({Message: "Actualizando jugadas"});
    }
    }
});

server.route({
    method: 'POST',
    path: '/insert_puesto',
    handler: function (request, reply) {

var query = 'Insert into tjugadas_puesto (Ticket, Usuario, Puesto, Caballo, Carrera, Monto, Fecha) values (' + request.payload.ticket + ', ' + request.payload.usuario + ', "' + request.payload.puesto + '",  ' + request.payload.caballo + ',  ' + request.payload.carrera + ',' + request.payload.monto + ', CURRENT_TIMESTAMP)';
var query_verify ='Select * from cond_apuest_puest where condicion="' + request.payload.puesto + '" and id_caballo=' + request.payload.caballo + '';    
    if(status_jugada[0].puesto==1 && datos_carrera[0].id_carrera==request.payload.carrera && datos_carrera[0].Status=="A")
    {
       connection.query(query_verify, function (error, results, fields) {
       if (error) reply({Message: "Error al ingresar jugada intente de nuevo"}); ;
       if(results.length>0)
       {
            connection.query(query, function (error, results, fields) {
               if (error) reply({Message: "Error al ingresar jugada intente de nuevo"}); ;

               if (results.affectedRows) {
                        reply({Message: "Ingresado Correctamente"}); 
                    } else {
                        reply({Message: "Error al ingresar jugada intente de nuevo"}); 
                    }
                     
               });
        }
        else
        {
             reply({Message: "Jugada actualizada intenete de nuevo"});
        }
     });
     }
     else
     {
        reply({Message: "Actualizando jugadas"});
     }
    }
});

server.route({
    method: 'POST',
    path: '/insert_tabla',
    handler: function (request, reply) {

    var query = 'Insert into tjugadas_tabla (ticket, usuario, precio, caballo, carrera, canti_juga, fecha) values (' + request.payload.ticket + ', ' + request.payload.usuario + ', ' + request.payload.precio + ',  ' + request.payload.caballo + ',  ' + request.payload.carrera + ',' + request.payload.canti_juga + ', CURRENT_TIMESTAMP)';
    var query_verify ='Select * from cond_apuest_tabl where precio="' + request.payload.precio + '" and id_caballo=' + request.payload.caballo + '';    
 
if(status_jugada[0].tabla==1 && datos_carrera[0].id_carrera==request.payload.carrera && datos_carrera[0].Status=="A")
    {
     connection.query(query_verify, function (error, results, fields) {
       if (error) reply({Message: "Error al ingresar jugada intente de nuevo"}); ;
       if(results.length>0)
       {
            connection.query(query, function (error, results, fields) {
               if (error) throw error;

               if (results.affectedRows) {
                        reply({Message: "Ingresado Correctamente"}); 
                    } else {
                        reply({Message: "Error al ingresar jugada intente de nuevo"}); 
                    }
                     
              });
             }
        else
        {
             reply({Message: "Jugada actualizada intenete de nuevo"});
        }
     });
    }else
    {
        reply({Message: "Actualizando jugadas"}); 
    }
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
            reply({message: "Bienvenido", alerta:mensaje});
        });

    
    }

});



server.route({
    method: 'POST',
    path: '/auth/taquilla',

    handler: function (request, reply) {
        
          connection.query('SELECT a.id as id_usua, a.nombre as nombre, a.status as status, b.Nombre as centro, a.mac, a.Tabla, a.Puesto, a.Marca, b.Monto_tabla, b.id as id_centro FROM usuario a inner join centro b where a.id_centro=b.id and a.usuario="' + request.payload.user + '" and a.contraseña="' + request.payload.pass + '" limit 1', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            if (results.length>0)
            {
               reply({message: "Bienvenido", user:results, alerta:mensaje});
            }
            else
            {
                reply({message: "Usuario o Contraseña Invalido"});
            }
        });    
    }

});

server.route({
    method: 'POST',
    path: '/auth/visor_admin',

    handler: function (request, reply) {
        
          connection.query('SELECT a.id as id_usua, a.nombre as nombre, a.status as status, b.Nombre as centro, a.mac, a.Nivel FROM usuario_admin a inner join centro b where a.id_centro=b.id and a.usuario="' + request.payload.user + '" and a.contraseña="' + request.payload.pass + '" limit 1', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            if (results.length>0)
            {
               reply({message: "Bienvenido", user:results, alerta:mensaje});
            }
            else
            {
                reply({message: "Usuario o Contraseña Invalido"});
            }
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
