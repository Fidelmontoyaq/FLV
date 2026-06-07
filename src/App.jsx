// src/App.jsx
import React, { useState } from 'react';
import { padronFiscalizadores } from "./components/fiscalizadoresData";

export default function App() {
  const [dni, setDni] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [amigos, setAmigos] = useState([]);
  const [error, setError] = useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    setError('');
    setUsuario(null);
    setAmigos([]);

    if (dni.trim().length !== 8 || isNaN(dni)) {
      setError('Por favor, ingresa un número de DNI válido de 8 dígitos.');
      return;
    }

    const encontrado = padronFiscalizadores.find(f => f.dni === dni.trim());

    if (encontrado) {
      setUsuario(encontrado);

      // Filtra compañeros que comparten el mismo Local de Votación
      const listaAmigos = padronFiscalizadores.filter(
        f => f.localVotacion === encontrado.localVotacion && f.dni !== encontrado.dni
      );
      setAmigos(listaAmigos);
    } else {
      setError('El DNI ingresado no se encuentra registrado en el padrón.');
    }
  };

  const handleLimpiar = () => {
    setDni('');
    setUsuario(null);
    setAmigos([]);
    setError('');
  };

  // Icono de estrella optimizado
  const IconoEstrella = () => (
    <svg 
      className="w-4 h-4 text-amber-500 fill-current inline-block ml-1.5 align-middle shrink-0" 
      viewBox="0 0 24 24"
      style={{ minWidth: '16px' }}
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
    </svg>
  );

  // Icono de escudo para contingencia
  const IconoEscudo = () => (
    <span className="ml-1.5 align-middle text-sm" title="Personal de Contingencia">🛡️</span>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-3 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        <div className="bg-[#A6192E] px-5 py-5 text-center text-white relative border-b-4 border-[#707372]">
          <h1 className="text-lg font-black tracking-wider uppercase">Consulta de Fiscalizadores</h1>
          <p className="text-slate-200 text-[11px] mt-0.5 font-medium tracking-wide">APP NO OFICIAL- Actualizado hasta el Domingo 9:00 am</p>
        </div>

        <div className="p-5">
          <form onSubmit={handleBuscar} className="space-y-4">
            <div>
              <label htmlFor="dni" className="block text-xs font-bold text-[#1C1F21] uppercase tracking-wider mb-1">
                Documento Nacional de Identidad (DNI)
              </label>
              <input
                type="text"
                id="dni"
                maxLength="8"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                placeholder="Ingresa los 8 dígitos"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#A6192E] focus:ring-1 focus:ring-[#A6192E] outline-none transition duration-200 text-xl tracking-widest font-mono text-center text-[#1C1F21] bg-slate-50"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#A6192E] hover:bg-[#851222] text-white font-bold py-3 rounded-xl transition duration-200 text-sm tracking-wide shadow-md"
              >
                CONSULTAR
              </button>
              {(usuario || error) && (
                <button
                  type="button"
                  onClick={handleLimpiar}
                  className="px-4 bg-slate-200 hover:bg-slate-300 text-[#1C1F21] font-semibold rounded-xl transition duration-200 text-sm"
                >
                  Limpiar
                </button>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-[#A6192E] text-xs text-red-700 font-bold rounded-r-xl">
              ❌ {error}
            </div>
          )}

          {usuario && (
            <div className="mt-5 space-y-4">
              <div className="bg-[#F4F5F6] border border-[#707372]/30 rounded-xl p-4 shadow-sm">
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                      Fiscalizador Consultado
                    </span>
                    <div className="block text-base font-black text-[#1C1F21] leading-snug">
                      <span className="align-middle">{usuario.apellidosNombres}</span>
                      {usuario.esResponsable && <IconoEstrella />}
                      {Number(usuario["# CONTRATO SIR"]) === 3000 && <IconoEscudo />}
                    </div>
                    
                    <span className="text-xs text-slate-600 font-medium block mt-1">
                      <span className="text-[#A6192E] font-bold">📍</span> Distrito: <span className="font-bold text-[#1C1F21]">{usuario.distrito}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-300/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">DNI</span>
                      <span className="text-sm font-mono font-bold text-[#1C1F21]">{usuario.dni}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Celular</span>
                      <span className="text-sm font-bold text-[#1C1F21]">📱 {usuario.celular}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-1 mb-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    🏛️ Local de Votación Asignado
                  </h3>
                  <span className="bg-[#A6192E]/5 text-[#A6192E] px-3 py-2 rounded-lg text-xs font-black border border-[#A6192E]/20 block text-center uppercase tracking-wide leading-tight">
                    {usuario.localVotacion}
                  </span>
                </div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  COMPAÑEROS DE LOCAL DE VOTACIÓN ({amigos.length})
                </p>

                {amigos.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {amigos.map((amigo, index) => (
                      <div key={index} className="p-3 bg-[#F4F5F6] rounded-lg border border-slate-200/60 text-xs">
                        <div className="block font-bold text-[#1C1F21] leading-snug mb-0.5">
                          <span className="align-middle">{amigo.apellidosNombres}</span>
                          {amigo.esResponsable && <IconoEstrella />}
                          {Number(amigo["# CONTRATO SIR"]) === 3000 && <IconoEscudo />}
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          Cel: {amigo.celular} <span className="text-slate-300 mx-1">•</span> Dist: {amigo.distrito}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-2">
                    No registra otros compañeros en este local.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
