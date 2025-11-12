import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Contexto global
const contexto = {
  historial: [],
  modo: "triple",
  resultado: 0,
};

// Función principal
const calcular = (expresion, modo) => {
  try {
    expresion = expresion.replace(/\s+/g, ""); // Eliminar espacios
    let pasos = [];
    let contador = 1;
    let resultadoFinal = eval(expresion); // Calcula con eval()

    // Para Generar los pasos tipo t1, t2, t3
    const tokens = expresion.match(/(\d+|\+|\-|\*|\/)/g);
    if (!tokens) return { resultado: "Error", detalle: "Expresión no válida." };

    // Multiplicación y división
    let tempTokens = [...tokens];
    while (tempTokens.includes("*") || tempTokens.includes("/")) {
      for (let i = 0; i < tempTokens.length; i++) {
        if (tempTokens[i] === "*" || tempTokens[i] === "/") {
          const a = parseFloat(tempTokens[i - 1]);
          const b = parseFloat(tempTokens[i + 1]);
          const op = tempTokens[i];
          const res = op === "*" ? a * b : a / b;
          pasos.push(`Paso ${contador}: t${contador} = ${a} ${op} ${b} → ${res}`);
          tempTokens.splice(i - 1, 3, res);
          contador++;
          break;
        }
      }
    }

    // Suma y resta
    let resultado = parseFloat(tempTokens[0]);
    for (let i = 1; i < tempTokens.length; i += 2) {
      const op = tempTokens[i];
      const b = parseFloat(tempTokens[i + 1]);
      const res = op === "+" ? resultado + b : resultado - b;
      pasos.push(`Paso ${contador}: t${contador} = ${resultado} ${op} ${b} → ${res}`);
      resultado = res;
      contador++;
    }

    // Los modos que realiza el programa
    const triple = resultadoFinal * 3;
    const cuadruplo = resultadoFinal * 4;
    let detalle = pasos.join("<br>");

    switch (modo) {
      case "triple":
        detalle += `<br><br>Triple: ${resultadoFinal} × 3 = ${triple}`;
        return { resultado: triple, detalle };
      case "cuadruplo":
        detalle += `<br><br>Cuádruplo: ${resultadoFinal} × 4 = ${cuadruplo}`;
        return { resultado: cuadruplo, detalle };
      case "ambos":
        detalle += `<br><br>Triple: ${triple} | Cuádruplo: ${cuadruplo}`;
        return { resultado: `${triple} / ${cuadruplo}`, detalle };
      default:
        return { resultado: resultadoFinal, detalle };
    }
  } catch (e) {
    return { resultado: "Error", detalle: "Operación no válida." };
  }
};

// para leer elementos del DOM
const selectModo = document.getElementById("modo");
const inputOperacion = document.getElementById("operacion");
const btnGenerar = document.getElementById("generar");
const btnLimpiar = document.getElementById("limpiar");
const divResultado = document.getElementById("resultado");
const divDetalle = document.getElementById("detalle");
const listaHistorial = document.getElementById("historial");

// Boton para generar la operacion
btnGenerar.addEventListener("click", () => {
  const expresion = inputOperacion.value.trim();
  const modo = selectModo.value;

  if (!expresion) {
    alert("Por favor, escribe una expresión primero.");
    return;
  }

  const { resultado, detalle } = calcular(expresion, modo);

  // para actualixar el historial
  contexto.resultado = resultado;
  contexto.historial.push(expresion);

  divDetalle.innerHTML = `<p>${detalle}</p>`;
  divResultado.innerHTML = `<strong>Resultado Final:</strong> ${resultado}`;
  listaHistorial.innerHTML = contexto.historial.map(op => `<li>${op}</li>`).join("");
});

// Para limpiar el historial
btnLimpiar.addEventListener("click", () => {
  inputOperacion.value = "";
  divResultado.innerHTML = "";
  divDetalle.innerHTML = "";
  selectModo.value = "triple";
});
