import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

const PASSWORD_BARBERO = 'mendoza341';s

// Función para obtener horarios según día
const getHorariosDia = (fecha) => {
  const diaSemana = fecha.getDay(); // 0 = domingo
  if (diaSemana === 0) return [];
  if (diaSemana >= 1 && diaSemana <= 5)
    return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  if (diaSemana === 6)
    return [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];
  return [];
};

function App() {
  const [turnos, setTurnos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [celular, setCelular] = useState('');
  const [verLoginBarbero, setVerLoginBarbero] = useState(false);
  const [barberoLogged, setBarberoLogged] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [mesActual, setMesActual] = useState(new Date());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('turnos')) || [];
    setTurnos(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('turnos', JSON.stringify(turnos));
  }, [turnos]);

  const reservarTurno = () => {
    if (
      !fechaSeleccionada ||
      !horaSeleccionada ||
      !nombre ||
      !apellido ||
      !celular
    ) {
      alert('Completa todos los campos y selecciona día y hora.');
      return;
    }
    const nuevoTurno = {
      fecha: fechaSeleccionada.toDateString(),
      dia: fechaSeleccionada.toLocaleDateString('es-AR', { weekday: 'long' }),
      hora: horaSeleccionada,
      nombre,
      apellido,
      celular,
    };
    setTurnos((prev) => [...prev, nuevoTurno]);
    setHoraSeleccionada('');
    setNombre('');
    setApellido('');
    setCelular('');
  };

  const borrarTurno = (idx) => {
    const newTurnos = [...turnos];
    newTurnos.splice(idx, 1);
    setTurnos(newTurnos);
  };

  const isOcupado = (fecha, hora) => {
    return turnos.some(
      (t) => t.fecha === fecha.toDateString() && t.hora === hora
    );
  };

  const diasDelMes = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const dias = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // ignorar horas para comparación

    for (let i = 1; i <= daysInMonth; i++) {
      const fecha = new Date(year, month, i);
      fecha.setHours(0, 0, 0, 0);
      if (fecha.getDay() !== 0) dias.push(fecha);
    }
    return dias;
  };

  const formatFecha = (fecha) => `${fecha.getDate()}/${fecha.getMonth() + 1}`;

  const loginBarbero = () => {
    if (passwordInput === PASSWORD_BARBERO) {
      setBarberoLogged(true);
      setVerLoginBarbero(false);
      setPasswordInput('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const mesSiguiente = () =>
    setMesActual(
      new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1)
    );
  const mesAnterior = () =>
    setMesActual(
      new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1)
    );

  if (barberoLogged) {
    return (
      <div className="container">
        <header>
          <h1>Zurdo Barber</h1>
          <p>Panel del Barbero</p>
          <button className="logout" onClick={() => setBarberoLogged(false)}>
            Salir
          </button>
        </header>

        <section className="turnos-section">
          <h2>Turnos Agendados</h2>
          {turnos.length === 0 && <p>No hay turnos reservados aún.</p>}
          {turnos.map((t, idx) => (
            <div key={idx} className="turno-card">
              <strong>
                {t.nombre} {t.apellido}
              </strong>{' '}
              | {t.celular}
              <br />
              {t.dia} {t.fecha} - {t.hora}
              <button className="borrar-turno" onClick={() => borrarTurno(idx)}>
                Borrar
              </button>
            </div>
          ))}
        </section>

        <footer>&copy; 2025 Zurdo Barber</footer>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>Zurdo Barber</h1>
        <p>Reserva tu turno en línea</p>
        <button
          className="barbero-btn"
          onClick={() => setVerLoginBarbero(true)}
        >
          Panel del Barbero
        </button>
      </header>

      {verLoginBarbero && (
        <section className="barbero-login">
          <input
            type="password"
            placeholder="Contraseña del Barbero"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button onClick={loginBarbero}>Ingresar</button>
          <button onClick={() => setVerLoginBarbero(false)}>Cancelar</button>
        </section>
      )}

      <section className="form-section">
        <h2>Reservar Turno</h2>
        <div className="form-inputs">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
          <input
            type="text"
            placeholder="Celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
          />
        </div>
      </section>

      <section className="calendario-section">
        <h2>
          Calendario:{' '}
          {mesActual.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <div className="mes-nav">
          <button onClick={mesAnterior}>◀</button>
          <button onClick={mesSiguiente}>▶</button>
        </div>
        <div className="calendario">
          {diasDelMes().map((dia, idx) => {
            const fechaHoy = new Date();
            fechaHoy.setHours(0, 0, 0, 0);
            const esPasado = dia < fechaHoy;

            return (
              <button
                key={idx}
                onClick={() => !esPasado && setFechaSeleccionada(dia)}
                className={
                  fechaSeleccionada?.toDateString() === dia.toDateString()
                    ? 'activo'
                    : ''
                }
                disabled={esPasado}
              >
                {formatFecha(dia)}
                <br />
                <span className="dia-nombre">
                  {dia.toLocaleDateString('es-AR', { weekday: 'short' })}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {fechaSeleccionada && (
        <section className="horarios-section">
          <h2>Horarios para {fechaSeleccionada.toDateString()}</h2>
          <div className="horarios">
            {getHorariosDia(fechaSeleccionada).map((hora) => (
              <button
                key={hora}
                onClick={() => setHoraSeleccionada(hora)}
                disabled={isOcupado(fechaSeleccionada, hora)}
                className={hora === horaSeleccionada ? 'activo' : ''}
              >
                {hora} {isOcupado(fechaSeleccionada, hora) ? '(ocupado)' : ''}
              </button>
            ))}
          </div>
          <button className="reservar" onClick={reservarTurno}>
            Reservar turno
          </button>
        </section>
      )}

      <footer>&copy; 2025 Zurdo Barber</footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
