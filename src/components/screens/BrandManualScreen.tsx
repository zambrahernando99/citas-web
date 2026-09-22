import React from 'react';

export const BrandManualScreen: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-10">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-[#002777] text-white rounded-full text-xs font-bold uppercase tracking-wider">
            Identidad Corporativa
          </span>
          <span className="text-xs text-[#757682]">• Manual de Marca Oficial</span>
        </div>
        <h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-[#001549]">
          Guía de Estilo y Sistema de Diseño
        </h1>
        <p className="text-sm text-[#444651] max-w-2xl mt-1">
          Especificaciones exactas de colorimetría institucional (Pantone 280 C), degradados oblicuos y jerarquía tipográfica con la familia Poppins.
        </p>
      </div>

      {/* 1. Colores Corporativos (Página 16) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e9e7ef] shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#e9e7ef]">
          <div>
            <span className="text-xs font-bold text-[#002777] uppercase tracking-wider">Lámina 16</span>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#001549]">
              Colores Corporativos Principales
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#f4f3fa] text-[#444651] font-mono">
            CMYK • RGB • HEX
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pantone 280 C */}
          <div className="rounded-2xl border border-[#e9e7ef] overflow-hidden shadow-sm flex flex-col">
            <div className="h-36 bg-[#002777] flex items-end p-4 text-white">
              <span className="font-headline font-bold text-lg">Pantone 280 C</span>
            </div>
            <div className="p-5 bg-white space-y-2 text-xs flex-1">
              <p className="font-bold text-sm text-[#001549]">Azul Institucional Primario</p>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">CMYK:</span>
                <span className="font-mono font-semibold text-[#1a1b21]">C:100 M:56 Y:21 K:10</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">RGB:</span>
                <span className="font-mono font-semibold text-[#1a1b21]">R:0 G:39 B:119</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#757682]">HEX:</span>
                <span className="font-mono font-bold text-[#002777]">#002777</span>
              </div>
            </div>
          </div>

          {/* Cool Gray 6 CP */}
          <div className="rounded-2xl border border-[#e9e7ef] overflow-hidden shadow-sm flex flex-col">
            <div className="h-36 bg-[#A3A6A9] flex items-end p-4 text-white">
              <span className="font-headline font-bold text-lg">Cool Gray 6 CP</span>
            </div>
            <div className="p-5 bg-white space-y-2 text-xs flex-1">
              <p className="font-bold text-sm text-[#001549]">Gris Neutro Medio</p>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">CMYK:</span>
                <span className="font-mono font-semibold text-[#1a1b21]">C:42 M:32 Y:29 K:0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">RGB:</span>
                <span className="font-mono font-semibold text-[#1a1b21]">R:163 G:166 B:169</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#757682]">HEX:</span>
                <span className="font-mono font-bold text-[#001549]">#A3A6A9</span>
              </div>
            </div>
          </div>

          {/* Cool Gray 2 CP */}
          <div className="rounded-2xl border border-[#e9e7ef] overflow-hidden shadow-sm flex flex-col">
            <div className="h-36 bg-[#D8D9D7] flex items-end p-4 text-[#1a1b21]">
              <span className="font-headline font-bold text-lg">Cool Gray 2 CP</span>
            </div>
            <div className="p-5 bg-white space-y-2 text-xs flex-1">
              <p className="font-bold text-sm text-[#001549]">Gris Neutro Claro / Superficie</p>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">CMYK:</span>
                <span className="font-mono font-semibold text-[#1a1b21]">C:18 M:13 Y:14 K:0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">RGB:</span>
                <span className="font-mono font-semibold text-[#1a1b21]">R:216 G:217 B:215</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#757682]">HEX:</span>
                <span className="font-mono font-bold text-[#001549]">#D8D9D7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Colores y Degradados (Página 17) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e9e7ef] shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#e9e7ef]">
          <div>
            <span className="text-xs font-bold text-[#002777] uppercase tracking-wider">Lámina 17</span>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#001549]">
              Degradados Oblicuos Institucionales
            </h2>
          </div>
          <span className="text-xs text-[#757682]">Ángulo de inclinación 45°</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gradient 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#f4f3fa] rounded-2xl border border-[#e9e7ef]">
            <div className="w-full h-32 rounded-3xl shadow-md mb-4 bg-gradient-to-r from-[#002777] via-[#0056c3] to-[#0B7CF5]"></div>
            <h4 className="font-headline font-bold text-base text-[#001549]">Degradado Primario</h4>
            <p className="text-xs text-[#444651] mt-1">Pantone 280 C a Azul Cielo Eléctrico</p>
            <span className="text-[11px] font-mono text-[#002777] mt-2 bg-white px-3 py-1 rounded-full border border-[#e9e7ef]">
              #002777 → #0B7CF5
            </span>
          </div>

          {/* Gradient 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#f4f3fa] rounded-2xl border border-[#e9e7ef]">
            <div className="w-full h-32 rounded-3xl shadow-md mb-4 bg-gradient-to-r from-[#78C8ED] to-[#002777]"></div>
            <h4 className="font-headline font-bold text-base text-[#001549]">Degradado Secundario</h4>
            <p className="text-xs text-[#444651] mt-1">Cian Suave a Pantone 280 C</p>
            <span className="text-[11px] font-mono text-[#002777] mt-2 bg-white px-3 py-1 rounded-full border border-[#e9e7ef]">
              #78C8ED → #002777
            </span>
          </div>

          {/* Gradient 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#f4f3fa] rounded-2xl border border-[#e9e7ef]">
            <div className="w-full h-32 rounded-3xl shadow-md mb-4 bg-gradient-to-r from-[#E4F4FB] via-[#b5c4ff] to-[#002777]"></div>
            <h4 className="font-headline font-bold text-base text-[#001549]">Degradado de Fondo</h4>
            <p className="text-xs text-[#444651] mt-1">Azul Pálido Superficie a Azul Institucional</p>
            <span className="text-[11px] font-mono text-[#002777] mt-2 bg-white px-3 py-1 rounded-full border border-[#e9e7ef]">
              #E4F4FB → #002777
            </span>
          </div>
        </div>
      </section>

      {/* 3. Tipografía Corporativa: Poppins (Página 20) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e9e7ef] shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#e9e7ef]">
          <div>
            <span className="text-xs font-bold text-[#002777] uppercase tracking-wider">Lámina 20</span>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#001549]">
              Tipografía Corporativa: Poppins
            </h2>
          </div>
          <span className="text-xs px-3 py-1 bg-[#dce1ff] text-[#00164d] font-bold rounded-full">
            Familia Primaria
          </span>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#f4f3fa] rounded-2xl border border-[#e9e7ef]">
            <p className="text-xs font-mono text-[#757682] uppercase mb-2">Muestra de Caracteres</p>
            <p className="text-2xl sm:text-3xl text-[#001549] font-normal leading-relaxed">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Ññ Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
            </p>
            <p className="text-xl sm:text-2xl text-[#002777] font-bold mt-2">
              0 1 2 3 4 5 6 7 8 9 & ( ! ? ¿ ¡ @ # $ % / = + - )
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#e9e7ef] shadow-xs">
              <span className="text-xs text-[#757682] font-semibold">Light 300</span>
              <p className="text-lg text-[#001549] font-light mt-1">Portal Citas Médico</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#e9e7ef] shadow-xs">
              <span className="text-xs text-[#757682] font-semibold">Regular 400</span>
              <p className="text-lg text-[#001549] font-normal mt-1">Portal Citas Médico</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#e9e7ef] shadow-xs">
              <span className="text-xs text-[#757682] font-semibold">SemiBold 600</span>
              <p className="text-lg text-[#001549] font-semibold mt-1">Portal Citas Médico</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#e9e7ef] shadow-xs">
              <span className="text-xs text-[#757682] font-semibold">Bold 700</span>
              <p className="text-lg text-[#001549] font-bold mt-1">Portal Citas Médico</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
