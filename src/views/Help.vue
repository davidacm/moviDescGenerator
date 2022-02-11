<template>
  <div>
    <h1 aria-live="assertive" tabindex="-1" ref="sFocus">
      Instrucciones de uso.
    </h1>

    <p>
      Esta aplicación permite cargar un audio o vídeo y agregar marcas de
      tiempo, a las cuales podremos adjuntar un texto. La idea inicial es que
      ese texto será utilizado para describir las escenas de un vídeo, para ser
      escuchado por personas ciegas después. Pero si encuentras otros usos o
      sugerencias, házmelas saber. Podría ser usada también, para subtitular o
      realizar transcripciones, pero no es su objetivo primario. Una marca de
      tiempo o "cue" es un elemento que se compone de:
    </p>
    <ul>
      <li>
        timestamp: es el momento justo en que esta marca debería ser reproducida
        al sincronizarla con el archivo de vídeo o audio con el que se trabaja
        actualmente.
      </li>
      <li>
        texto: el texto que debería ser verbalizado o mostrado, según el uso que
        le dé la aplicación final.
      </li>
    </ul>
    <p>
      Aunque es una aplicación web, todo el funcionamiento es realizado en su
      equipo. No hay ninguna conexión con ningún servidor.
    </p>
    <p>
      La aplicación permite cargar cualquier archivo de audio o vídeo, siempre
      que el navegador tenga la capacidad para reproducir el formato del
      archivo. Todos los navegadores suelen comportarse distinto, pero los
      archivos mp4 y mp3 suelen funcionar sin problemas. Aunque si su vídeo se
      encuentra en otro formato, intenta cargarlo antes de hacer una conversión
      hacia otro formato. De no funcionar, entonces deberás realizar la
      conversión hacia un formato compatible. Por ejemplo mp4 en el caso de un
      archivo de vídeo, mp3 en el caso de un archivo de audio.
    </p>
    <p>
      También se pueden importar archivos con marcas de tiempo, por si queremos
      actualizar o continuar un trabajo previamente realizado. En este aspecto
      soporta los formatos SRT, WebVtt, y el generado por la aplicación
      pinpoint. Si considera que otro formato debería estar en la lista, házmelo
      saber y consideraré su viabilidad.
    </p>
    <h2>Descripción y uso de interfaz.</h2>
    <p>
      La aplicación cuenta con dos pestañas. Una de trabajo, y la otra de
      configuración.
    </p>
    <h3>Pestaña de trabajo.</h3>
    <p>
      En la pestaña de trabajo tenemos varios controles autoexplicativos. Pero
      antes de comenzar a trabajar, debemos cargar un archivo de vídeo o de
      audio. Puede ser en formato mp3 o mp4. Si el archivo no es reproducido,
      puede que su navegador web no tenga soporte para ese formato de archivo y
      deba ser convertido a otro formato. En edge y chrome, mp3 y mp4 han
      funcionado sin problemas.
    </p>
    <p>
      En primera instancia se encuentra un menú desplegable de opciones, que
      podemos abrir pulsando click, espacio o enter. Para cerrarlo, basta con
      pulsar escape. En este menú podremos hacer lo siguiente:
    </p>
    <ol>
      <li>
        Donar al proyecto. Por si encuentras de utilidad este proyecto, y deseas
        colaborarme de alguna manera.
      </li>
      <li>
        Abrir archivo multimedia. Puede ser un archivo de audio o vídeo, una vez
        que sea correctamente cargado, se mostrarán los controles del
        reproductor y los controles para la gestión de marcas de tiempo.
      </li>
      <li>
        abrir archivo de descripciones. En formato srt, webVtt o pinpoint, por
        si tienes un trabajo previo o has usado algún reconocimiento de voz y
        ayudarte a adelantar camino con las descripciones.
      </li>
      <li>
        descargar descripciones actuales. Descarga un archivo vtt con todo el
        trabajo realizado hasta el momento. Para que lo compartas con alguien o
        lo utilices para después.
      </li>
      <li>
        guardar todo en localStorage: guarda el trabajo actual en el navegador,
        para continuarlo después. Se recomienda hacer esto con frecuencia, para
        evitar pérdidas de trabajo.
      </li>
      <li>
        borrar todo: limpia todas las descripciones realizadas. No pide
        confirmación ¡tener mucho cuidado con esta opción!
      </li>
      <li>
        offset: mueve todas las descripciones n segundos hacia la izquierda o
        derecha. Por ahora, solo es útil si queremos realizar pruebas y el
        archivo que hemos cargado tiene una duración distinta al original. No
        modifica de ninguna manera la marca de tiempo de las descripciones
        realizadas.
      </li>
    </ol>
    <p>
      Una vez que hayamos cargado un archivo de vídeo o audio, se mostrarán los
      controles típicos de un reproductor. Si al cargar el archivo la aplicación
      encuentra que existen datos asociados al nombre del archivo en el local
      storage, cargará las descripciones previamente guardadas en el local
      storage. Nota: si tenemos descripciones precargadas y volvemos a abrir un
      archivo de descripciones, el sistema lo aceptará. En este caso, podríamos
      quedar con descripciones duplicadas.
    </p>
    <p>
      Cuando se muestra la interfaz de descripciones, tenemos dos encabezados:
      uno para el control del reproductor, y otro para la gestión de
      descripciones.
    </p>
    <h4>sección de gestión de descripciones.</h4>
    <p>En esta sección tenemos lo siguiente:</p>
    <ol>
      <li>
        cues: una lista de todas las marcas de tiempo creadas hasta el momento.
        Se muestra únicamente el número consecutivo y el texto asociado. Aquí
        podemos seleccionar una marca y modificarla si lo deseamos.
      </li>
      <li>
        descripción: la descripción que deberá ser pronunciada en la marca de
        tiempo actual.
      </li>
      <li>
        timestamp: el tiempo en segundos en el que esta marca será reproducida.
        Podemos cambiarlo, pero recuerda que se aceptan únicamente números, con
        3 decimales como máximo.
      </li>
      <li>
        reproducir marca anterior: nos lleva el cursor de marcas hacia la
        anterior, y la reproduce, tanto en audio como el texto con voz (si la
        voz está disponible)
      </li>
      <li>
        reproducir marca actual: reproduce la marca actual, tanto en audio como
        el texto con voz (si la voz está disponible)
      </li>
      <li>
        reproducir marca siguiente: nos lleva el cursor de marcas hacia la
        siguiente, y la reproduce, tanto en audio como el texto con voz (si la
        voz está disponible)
      </li>
      <li>
        borrar marca actual: elimina la marca actual, pero puede ser recuperada.
      </li>
      <li>-0.5 segs: mueve la marca actual 0.5 segundos a la izquierda.</li>
      <li>-1 segs: mueve la marca actual 1 segundos a la izquierda.</li>
      <li>+1 segs: mueve la marca actual 1 segundos a la derecha.</li>
      <li>+0.5 segs: mueve la marca actual 0.5 segundos a la derecha.</li>
      <li>
        Añadir nueva marca: inserta una nueva marca en el tiempo multimedia
        actual. Es decir, el tiempo actual del audio o vídeo cargado.
      </li>
      <li>
        reproducir con descripciones: reproduce el archivo multimedia y las
        descripciones, útil por si queremos probar si las descripciones están
        correctamente sincronizadas.
      </li>
      <li>
        Deshacer última marca borrada: reinserta la última marca borrada, con su
        respectiva descripción y marca de tiempo. Puedes recuperar tantas marcas
        como quieras.
      </li>
    </ol>
    <p>
      Nota: los controles del 2 al 11 se muestran únicamente cuando hay una
      marca seleccionada, puedes seleccionar las marcas en la lista de cues.
    </p>
    <h3>Comandos de teclado:</h3>
    <p>
      Las teclas no siguen un orden inicial de la acción, si no que la mayoría
      están dispuestas para que sean fáciles de recordar: Todos los comandos
      requieren además, presionar alt + shift.
    </p>
    <ol>
      <li>
        Exportar trabajo actual al formato webVtt y descargarlo en su equipo: E.
      </li>
      <li>
        Buscar marca anterior más cercana al tiempo actual del vídeo: Y griega.
      </li>
      <li>Reproducir vídeo en la descripción anterior: U.</li>
      <li>Reproducir vídeo en la descripción actual: I.</li>
      <li>reproducir vídeo en la descripción siguiente: O.</li>
      <li>Salvar trabajo actual en el local storage: s</li>
      <li>Eliminar marca / descripción actual: G.</li>
      <li>Recuperar descripción eliminada: H.</li>
      <li>Retroceder 5 segundos: j.</li>
      <li>pausa / reproducir: k.</li>
      <li>Adelantar 5 segundos: l</li>
      <li>Mover posición de marca actual un segundo hacia la izquierda: d.</li>
      <li>Mover posición de marca actual un segundo hacia la derecha: f.</li>
      <li>
        Mover posición de marca actual medio segundo hacia la izquierda: c.
      </li>
      <li>Mover posición de marca actual medio segundo hacia la derecha: v.</li>
      <li>Crear nueva marca / descripción en el tiempo actual: n.</li>
      <li>reducir velocidad de la reproducción: ","</li>
      <li>aumentar velocidad de la reproducción: "."</li>
      <li>Establecer velocidad de reproducción a la estándar (1x): "-".</li>
    </ol>
    <h3>Pantalla de configuración.</h3>
    <p>Aquí se configuran algunos comportamientos de la aplicación.</p>
    <ul>
      <li>
        Leer descripciones con lector de pantallas. Permite que el lector de
        pantallas lea la descripción actual, si un lector de pantallas estuviese
        disponible.
      </li>
      <li>
        Usar síntesis de voz del sistema: permite que la aplicación lea las
        descripciones con alguna voz que se haya configurado, si el sistema
        cuenta con voces instaladas.
      </li>
    </ul>
    <h4>Configuración de voz.</h4>
    <p>
      Si se activa la opción "Usar síntesis de voz del sistema", se añadirán las
      siguientes opciones en la pantalla de configuración:
    </p>
    <ul>
      <li>idioma de la voz: el idioma usado para leer las descripciones.</li>
      <li>
        voz para leer descripciones: la voz correspondiente al idioma
        seleccionado, para leer las descripciones.
      </li>
      <li>velocidad: la velocidad de la voz.</li>
      <li>tono: el tono de la voz, más grave o más agudo.</li>
      <li>
        Mensaje de prueba: puede escribir un texto en dicho campo o dejar el
        texto por defecto, para probar la voz seleccionada.
      </li>
      <li>
        probar voz: al activar este botón, se leerá el texto escrito en el campo
        anterior, con la voz y el idioma seleccionados.
      </li>
      <li>
        Guardar configuraciones de voz: guardará las configuraciones de voz, de
        manera que se utilizará el mismo idioma y la misma voz al iniciar la
        aplicación nuevamente.
      </li>
    </ul>
    <h2>notas:</h2>
    <ol>
      <li>
        Si se opta por usar voces en línea como las de Microsoft o Google, es
        posible que tenga desfases debido a la latencia que poseen estas voces.
      </li>
      <li>
        Las marcas borradas no se guardan en el local storage, por lo que si
        recargas tu proyecto, no podrás recuperar las marcas borradas en la
        sesión anterior.
      </li>
      <li>
        Acctualmente, el reproductor de descripciones no funciona a velocidades
        distintas de 1x, tenlo en cuenta al realizar pruebas. Se implementará
        esta compatibilidad a futuro.
      </li>
      <li>
        Actualmente no se puede regular el volumen de la voz, se espera
        implementar esta funcionalidad más adelante.
      </li>
    </ol>
    <h2>Sugerencias, donaciones, agradecimientos.</h2>
    <p>
      Si esta aplicación te ha resultado útil y deseas colaborar con su
      mantenimiento y desarrollo, puedes contribuir con una donación voluntaria.
      Usa los siguientes medios:
    </p>
    <ul>
      <li><a href="https://paypal.me/davicm">PayPal.</a></li>
      <li><a href="https://ko-fi.com/davidacm">Ko-fi.</a></li>
      <li>
        <a href="https://davidacm.github.io/donations/"
          >Criptomonedas y otros métodos.</a
        >
      </li>
    </ul>
    <p>
      Si deseas corregir errores, reportar problemas o nuevas características,
      puedes comunicarte conmigo al correo:
      <a
        href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#100;&#104;&#102;&#51;&#54;&#48;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;"
        >&#100;&#104;&#102;&#51;&#54;&#48;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;</a
      >.
    </p>
    <p>Copyright (C) 2021 David CM.</p>
  </div>
</template>

<script>
export default {
  name: "Help",
  mounted() {
    this.$refs.sFocus.focus();
  },
  methods: {
    close() {
      this.$emit("onclose");
    },
  },
};
</script>
<style scoped>
@charset "utf-8";
body {
  font-family: Verdana, Arial, Helvetica, Sans-serif;
  color: #ffffff;
  background-color: #000000;
  line-height: 1.2em;
}
h1,
h2 {
  text-align: center;
}
dt {
  font-weight: bold;
  float: left;
  width: 10%;
  clear: left;
}
dd {
  margin: 0 0 0.4em 0;
  float: left;
  width: 90%;
  display: block;
}
p {
  clear: both;
}
a {
  text-decoration: underline;
}
:active {
  text-decoration: none;
}
a:focus,
a:hover {
  outline: solid;
}
:link {
  color: #0000ff;
  background-color: #ffffff;
}
</style>