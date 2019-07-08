wumpus
======

A simple test designed for the interview process at Connected Health Services. 

Please fork this repo in your account and develop a Java program that implements the rules for the Wumpus Game (see included Powerpoint). You are expected to write the complete game logic, and use simple text interactions to drive the game play (like the text-based adventure games from the old days, http://en.wikipedia.org/wiki/Text-based_game).

Bonus points for unit tests ;).

Please use Eclipse as your IDE and whatever version of Java you are most confortable with (Scala or Groovy also welcomed). Use whatever framework you prefer for your unit tests.

RESOLUCIÓN
======
Siguiendo instrucciones de Emma Perez, de Robert Walters Valencia, he realizado este test con Angular 8

Como se trata de una prueba para Frontend, he pensado que no tenía demasiado sentido realizar el juego con Angular y solo en modo texto, así que he añadido también una interfaz gráfica sencilla y el manejo con las flechas del teclado, pero que permitirá valorar mejor mi destreza en proyectos de este tipo. Aún así, he mantenido el funcionamiento a través de órdenes escritas en un cuadro de texto, que son:
- L giro a la izquierda 90º (de Left, o se puede usar la flecha izquierda)
- R, giro a la derecha 90º (de Right, o se puede usar la flecha derecha)
- W, andar (de Walk, o se puede usar la flecha hacia arriba)
- F, disparar (de Fire, o se puede usar CTRL)
- X, salir (de eXit, o se puede usar también la barra espaciadora)

El proyecto está realizado con Angular 8, aunque creo que también se podría hacer sobre Angular 6 o 7. Solo tengo dudas con la técnica de captura de las teclas presionadas, ya que no recuerdo si con Angular 6 también se hacía así.

El cazador percibe en las adyacentes el hedor del Wumpus, y la brisa de los pozos. He hecho también que pudiese percibir el brillo del oro para bajar la dificultad del juego, aunque esta característica está comentada ya que no se indicó en las especificaciones.

El proyecto de test lo he realizado utilizando TestCafe, que solo dependende de Node, y se instala con "npm install" desde su carpeta ya que las dependencias están especificadas en su 'package.json', junto con 'testcafe-angular-selectors'. Son pruebas de aceptación, no tests unitarios, ya que no hay parte backend ni componentes independientes que podamos comprobar de forma unitaria. Los tests se hacen contra el servidor localhost:4200, que es dónde se ejecuta Angular por defecto, así que para lanzarlos, primero se debe ejecutar el proyecto 'game'  luego lanzar los tests desde otra ventana CMD o PowerShell.

Pasos para probar el juego:
- Desde una ventana CMD o PowerShell, desde la carpeta '/game' del proyecto: ejecutar 'ng s -o'. Esto lanzará una ventana en el navegador predeterminado con la página del juego, localizada en http://localhost:4200 y que se puede ver cómo queda en el fichero WumpusGame.png del repositorio. No obstante, he subido el juego a mi servidor y se puede probar en http://wumpus.acalle.com

Para ejecutar los test:
- Con el juego en ejecución, desde otra ventana CMD o PowerShell en la carpeta '/test' del proyecto, ejecutar: 'npm test'. Esto lanza una ventana, como la que se puede ver en el fichero TestingImage.png del repositorio, dónde mostrará el éxito o error en los tests, mientras que los ejecuta en una ventana del navegador que abrirá para automatizar esas tareas de testeo.

Se han realizado dos tests, aunque cada uno lleva varias acciones:
- El primero sirve para comprobar que el juego permite iniciarse y los parámetros que se le establecen son procesados correctamente
- El segunto comprueba los movimientos y disparo dentro del juego.

