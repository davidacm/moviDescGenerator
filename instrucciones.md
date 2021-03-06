# moviDesc creator.

Esta aplicación permite cargar un audio o vídeo y agregar marcas de tiempo, a las cuales podremos adjuntar un texto. La idea inicial es que ese texto será utilizado para describir las escenas de un vídeo, para ser escuchado por personas ciegas después. Pero si encuentras otros usos o sugerencias, házmelas saber.
Podría ser usada también, para subtitular o realizar transcripciones, pero no es su objetivo primario.
Una marca de tiempo o "cue" es un elemento que se compone de:

* timestamp: es el momento justo en que esta marca debería ser reproducida al sincronizarla con el archivo de vídeo o audio con el que se trabaja actualmente.
* texto: el texto que debería ser verbalizado o mostrado, según el uso que le dé la aplicación final.

Aunque es una aplicación web, todo el funcionamiento es realizado en su equipo. No hay ninguna conexión con ningún servidor.

La aplicación permite cargar cualquier archivo de audio o vídeo, siempre que el navegador tenga la capacidad para reproducir el formato del archivo. Todos los navegadores suelen comportarse distinto, pero los archivos mp4 y mp3 suelen funcionar sin problemas. Aunque si su vídeo se encuentra en otro formato, intenta cargarlo antes de hacer una conversión hacia otro formato. De no funcionar, entonces deberás realizar la conversión hacia un formato compatible. Por ejemplo mp4 en el caso de un archivo de vídeo, mp3 en el caso de un archivo de audio.

También se pueden importar archivos con marcas de tiempo, por si queremos actualizar o continuar un trabajo previamente realizado.
En este aspecto soporta los formatos SRT, WebVtt, y el generado por la aplicación pinpoint. Si considera que otro formato debería estar en la lista, házmelo saber y consideraré su viabilidad.

## Descripción y uso de interfaz.
La aplicación cuenta con dos pestañas. Una de trabajo, y la otra de configuración.

### Pestaña de trabajo.

En la pestaña de trabajo tenemos varios controles autoexplicativos. Pero antes de comenzar a trabajar, debemos cargar un archivo de vídeo o de audio. Puede ser en formato mp3 o mp4. Si el archivo no es reproducido, puede que su navegador web no tenga soporte para ese formato de archivo y deba ser convertido a otro formato. En edge y chrome, mp3 y mp4 han funcionado sin problemas.

En primera instancia se encuentra un menú desplegable de opciones, que podemos abrir pulsando click, espacio o enter. Para cerrarlo, basta con pulsar escape. En este menú podremos hacer lo siguiente:

1. Donar al proyecto. Por si encuentras de utilidad este proyecto, y deseas colaborarme de alguna manera.
2. Abrir archivo multimedia. Puede ser un archivo de audio o vídeo, una vez que sea correctamente cargado, se mostrarán los controles del reproductor y los controles para la gestión de marcas de tiempo.
3. abrir archivo de descripciones. En formato srt, webVtt o pinpoint, por si tienes un trabajo previo o has usado algún reconocimiento de voz y ayudarte a adelantar camino con las descripciones.
4. descargar descripciones actuales. Descarga un archivo vtt con todo el trabajo realizado hasta el momento. Para que lo compartas con alguien o lo utilices para después.
5. guardar todo en localStorage: guarda el trabajo actual en el navegador, para continuarlo después. Se recomienda hacer esto con frecuencia, para evitar pérdidas de trabajo.
6. borrar todo: limpia todas las descripciones realizadas. No pide confirmación ¡tener mucho cuidado con esta opción!
7. offset: mueve todas las descripciones n segundos hacia la izquierda o derecha. Por ahora, solo es útil si queremos realizar pruebas y el archivo que hemos cargado tiene una duración distinta al original. No modifica de ninguna manera la marca de tiempo de las descripciones realizadas.

Una vez que hayamos cargado un archivo de vídeo o audio, se mostrarán los controles típicos de un reproductor. Si al cargar el archivo la aplicación encuentra que existen datos asociados al nombre del archivo en el local storage, cargará las descripciones previamente guardadas en el local storage.
Nota: si tenemos descripciones precargadas y volvemos a abrir un archivo de descripciones, el sistema lo aceptará. En este caso, podríamos quedar con descripciones duplicadas.

Cuando se muestra la interfaz de descripciones, tenemos dos encabezados: uno para el control del reproductor, y otro para la gestión de descripciones.

#### sección de gestión de descripciones.

En esta sección tenemos lo siguiente:

1. cues: una lista de todas las marcas de tiempo creadas hasta el momento. Se muestra únicamente el número consecutivo y el texto asociado. Aquí podemos seleccionar una marca y modificarla si lo deseamos.
2. descripción: la descripción que deberá ser pronunciada en la marca de tiempo actual.
3. timestamp: el tiempo en segundos en el que esta marca será reproducida. Podemos cambiarlo, pero recuerda que se aceptan únicamente números, con 3 decimales como máximo.
4. reproducir marca anterior: nos lleva el cursor de marcas hacia la anterior, y la reproduce, tanto en audio como el texto con voz (si la voz está disponible)
5. reproducir marca actual: reproduce la marca actual, tanto en audio como el texto con voz (si la voz está disponible)
6. reproducir marca siguiente: nos lleva el cursor de marcas hacia la siguiente, y la reproduce, tanto en audio como el texto con voz (si la voz está disponible)
7. borrar marca actual: elimina la marca actual, pero puede ser recuperada.
8. -0.5 segs: mueve la marca actual 0.5 segundos a la izquierda.
9. -1 segs: mueve la marca actual 1 segundos a la izquierda.
10. +1 segs: mueve la marca actual 1 segundos a la derecha.
11. +0.5 segs: mueve la marca actual 0.5 segundos a la derecha.
12. Añadir nueva marca: inserta una nueva marca en el tiempo multimedia actual. Es decir, el tiempo actual del audio o vídeo cargado.
13. reproducir con descripciones: reproduce el archivo multimedia y las descripciones, útil por si queremos probar si las descripciones están correctamente sincronizadas.
14. Deshacer última marca borrada: reinserta la última marca borrada, con su respectiva descripción y marca de tiempo. Puedes recuperar tantas marcas como quieras.

Nota: los controles del 2 al 11 se muestran únicamente cuando hay una marca seleccionada, puedes seleccionar las marcas en la lista de cues.


### Comandos de teclado:
Las teclas no siguen un orden inicial de la acción, si no que la mayoría están dispuestas para que sean fáciles de recordar:
Todos los comandos requieren además, presionar alt + shift.

1. Exportar trabajo actual al formato webVtt y descargarlo en su equipo: E.
2. Buscar marca anterior más cercana al tiempo actual del vídeo: Y griega.
3. Reproducir vídeo en la descripción anterior: U.
4. Reproducir vídeo en la descripción actual: I.
5. reproducir vídeo en la descripción siguiente: O.
6. Salvar trabajo actual en el local storage: s
7. Eliminar marca / descripción actual: G.
8. Recuperar descripción eliminada: H.
9. Retroceder 5 segundos: j.
10. pausa / reproducir: k.
11. Adelantar 5 segundos: l
12. Mover posición de marca actual un segundo hacia la izquierda: d.
13. Mover posición de marca actual un segundo hacia la derecha: f.
14. Mover posición de marca actual medio segundo hacia la izquierda: c.
15. Mover posición de marca actual medio segundo hacia la derecha: v.
16. Crear nueva marca  / descripción en el tiempo actual: n.
17. reducir velocidad de la reproducción: ","
18. aumentar velocidad de la reproducción: "."
19. Establecer velocidad de reproducción a la estándar (1x): "-".

### Pantalla de configuración.

Aquí se configuran algunos comportamientos de la aplicación.

* Leer descripciones con lector de pantallas. Permite que el lector de pantallas lea la descripción actual, si un lector de pantallas estuviese disponible.
* Usar síntesis de voz del sistema: permite que la aplicación lea las descripciones con alguna voz que se haya configurado, si el sistema cuenta con voces instaladas.

#### Configuración de voz.

Si se activa la opción "Usar síntesis de voz del sistema", se añadirán las siguientes opciones en la pantalla de configuración:

* idioma de la voz: el idioma usado para leer las descripciones.
* voz para leer descripciones: la voz correspondiente al idioma seleccionado, para leer las descripciones.
* velocidad: la velocidad de la voz.
* tono: el tono de la voz, más grave o más agudo.
* Mensaje de prueba: puede escribir un texto en dicho campo o dejar el texto por defecto, para probar la voz seleccionada.
* probar voz: al activar este botón, se leerá el texto escrito en el campo anterior, con la voz y el idioma seleccionados.
* Guardar configuraciones de voz: guardará las configuraciones de voz, de manera que se utilizará el mismo idioma y la misma voz al iniciar la aplicación nuevamente.

## notas:

1. Si se opta por usar voces en línea como las de Microsoft o Google, es posible que tenga desfases debido a la latencia que poseen estas voces.
2. Las marcas borradas no se guardan en el local storage, por lo que si recargas tu proyecto, no podrás recuperar las marcas borradas en la sesión anterior.
3. Acctualmente, el reproductor de descripciones no funciona a velocidades distintas de 1x, tenlo en cuenta al realizar pruebas. Se implementará esta compatibilidad a futuro.
4. Actualmente no se puede regular el volumen de la voz, se espera implementar esta funcionalidad más adelante.

## Sugerencias, donaciones, agradecimientos.

Si esta aplicación te ha resultado útil y deseas colaborar con su mantenimiento y desarrollo, puedes contribuir con una donación voluntaria. Usa  los siguientes medios:

* [PayPal.](https://paypal.me/davicm)
* [Ko-fi.](https://ko-fi.com/davidacm)
* [Criptomonedas y otros métodos.](https://davidacm.github.io/donations/)

Si deseas corregir errores, reportar problemas o nuevas características, puedes comunicarte conmigo al correo: <dhf360@gmail.com>.


Copyright (C) 2021 David CM.
