import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/formulario.css'; // Importar el archivo de estilos CSS
import Login from './login';  //importar el login

const Formulario = () => {
  const [token, setToken] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(0);
  const [fecha, setFecha] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [ticket, setTicket] = useState('');
  const [especialista, setEspecialista] = useState('');
  const [resumen, setResumen] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [relevos, setRelevos] = useState([]);

  const data = {
    Fecha: fecha,
    Proyecto: proyecto,
    Ticket: ticket,
    Especialista: especialista,
    Resumen: resumen,
  };

  const obtenerRelevos = async () => {
    try {
      const response = await axios.get(`http://10.70.131.130:3000/relevos`, {
        headers: {
          Authorization: token,
        },
      });
      setRelevos(response.data);
    } catch (error) {
      console.log("no se pudo conectar por localhost, se intenta conectar por ip");
      try {
        const response = await axios.get(`http://localhost:3000/relevos`, {
          headers: {
            Authorization: token,
          },
        });
        console.log("success get");
        setRelevos(response.data);
      } catch (e) {
        console.error('Error al obtener los relevos:', error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      obtenerRelevos();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha || !proyecto || !ticket || !especialista || !resumen) {
      setMensajeExito('');
      setMensajeError('Todos los campos son obligatorios');
      return;
    }
    try {
      await axios.post(`http://10.70.131.130:3000/relevos`, data, {
        headers: {
          Authorization: token,
        },
      });
      setMensajeExito('Relevo creado exitosamente');
      setMensajeError('');
      setFecha('');
      setProyecto('');
      setTicket('');
      setEspecialista('');
      setResumen('');
    } catch (error) {
      console.log("no se pudo conectar por localhost, se conecta intenta por ip");
      try {
        await axios.post(`http://localhost:3000/relevos`, data, {
          headers: {
            Authorization: token,
          },
        });
        console.log("success post");
        setMensajeExito('Relevo creado exitosamente');
        setMensajeError('');
        setFecha('');
        setProyecto('');
        setTicket('');
        setEspecialista('');
        setResumen('');
      } catch (e) {
        setMensajeExito('');
        setMensajeError('Error al crear el relevo');
        console.error(error);
      }

    }
  };

  const enviarCorreo = async () => {
    // Obtén los datos de los relevos desde alguna fuente
    await obtenerRelevos();
    const proyectos = [
      { nombre: 'CANVIA', destinatario: 'rchacon@canvia.com' },
      /*{ nombre: 'UNIQUE', destinatario: 'rchacon@canvia.com'  },
      { nombre: 'CAMPOSOL', destinatario: 'rchacon@canvia.com' },
      { nombre: 'PPS', destinatario: 'rchacon@canvia.com'  },
      { nombre: 'PPV' , destinatario: 'rchacon@canvia.com' },
      { nombre: 'VOLCAN', destinatario: 'rchacon@canvia.com' },
      { nombre: 'PRIMA', destinatario: 'rchacon@canvia.com' },*/
    ];

    for (const proyecto of proyectos) {
      console.log(relevos);
      // Filtrar los relevos por nombre
      const relevosFiltrados = relevos.filter((relevo) => relevo.proyecto === proyecto.nombre);
      if (relevosFiltrados.length >= 0) {
        //generar tabla de relevos segun el nombre
        const contenidoProyecto = generarTablaRelevos(relevosFiltrados);
        try {
          //enviar datos al api
          const response = await fetch('http://10.70.131.130:3000/enviar-correo', {
            method: 'POST',
            body: JSON.stringify({
              destinatario: proyecto.destinatario,
              asunto: `Relevos del proyecto ${proyecto.nombre}`,
              contenido: contenidoProyecto
            })
          });
          if (response.ok) {
            console.log(`Correo a ${proyecto.nombre} enviado exitosamente`);
          } else {
            console.error(`Error al enviar el correo a ${proyecto.nombre}`);
          }
        } catch (error) {
          try {
            const response = await fetch('http://localhost:3000/enviar-correo', {
              method: 'POST',
              body: JSON.stringify({
                destinatario: proyecto.destinatario,
                asunto: `Relevos del proyecto ${proyecto.nombre}`,
                contenido: contenidoProyecto
              })
            });
  
            if (response.ok) {
              console.log(`Correo a ${proyecto.nombre} enviado exitosamente`);
            } else {
              console.error(`Error al enviar el correo a ${proyecto.nombre}`);
            }
          }catch (e) {
            console.error(`Error al enviar el correo a ${proyecto.nombre}`, error);
          }
        }
      }
    }
  };

  // Genera la tabla de relevos en formato tabular
  const generarTablaRelevos = (relevos) => {
    let tabla = '';

    relevos.forEach((relevo) => {
      const fecha = new Date(relevo.fecha).toLocaleDateString();
      tabla += `Fecha: ${fecha} | Proyecto: ${relevo.proyecto}  | Ticket: ${relevo.ticket}  | Especialista: ${relevo.Especialista}  | Resumen_de_Ticket: ${relevo.Resumen}\n`;
    });

    return tabla;
  };

  return (
    <div>
      {token ? (
        <div className="formulario">
          <form onSubmit={handleSubmit}>
            <h1>CheckList de Relevo </h1>

            {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
            {mensajeError && <div className="mensaje-error">{mensajeError}</div>}

            <label htmlFor="fecha">Fecha:</label>
            <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />

            <label htmlFor="proyecto">Proyecto:</label>
            <select id="proyecto" value={proyecto} onChange={(e) => setProyecto(e.target.value)}>
              <option value="">Seleccione un proyecto</option>
              <option value="CANVIA">CANVIA</option>
              <option value="PPS">PPS</option>
              <option value="PPV">PPV</option>
              <option value="PRIMA">PRIMA</option>
              <option value="UNIQUE">UNIQUE</option>
              <option value="VOLCAN">VOLCAN</option>
              <option value="CAMPOSOL">CAMPOSOL</option>
            </select>

            <label htmlFor="ticket">Ticket:</label>
            <input type="text" id="ticket" value={ticket} onChange={(e) => setTicket(e.target.value)} />

            <label htmlFor="especialista">Especialista:</label>
            <input type="text" id="especialista" value={especialista} onChange={(e) => setEspecialista(e.target.value)} />

            <label htmlFor="resumen">Resumen de Ticket:</label>
            <textarea id="resumen" value={resumen} onChange={(e) => setResumen(e.target.value)} />

            <button id='enviar' type="submit">Enviar</button>
            <br></br>
          </form>
          {tipoUsuario === 1 && (
            <button id='enviarCorreosButton' type="button" onClick={enviarCorreo}>
              Enviar Correo
            </button>
          )}
        </div>
      ) : (
        <Login setToken={setToken} setUsuario={setTipoUsuario} />
      )}
    </div>
  );
};

export default Formulario;
