
/*$( document ).ready(function() {  
	clasificador();
});*/
console.log("¡¡LISTO PARA CLASIFICAR!!");
function clasificador()
{
	//Matriz de caracteristicas Iris
	x = data();
	//Genero la mejor matriz de pesos
	pesos = genetico();
	//Vector con elementos clasificados
	clasificados = new Array();
	var confusion = new Array(2);
	var origen = 0;
	
	//Hago clasificacion por caracteristicas
	x.forEach( function(feature){
		clasificados.push( Math.round( perceptron(feature,pesos) )  );
	});

	//Inicializo matriz de confusion en 0's para solo sumar
	for(var i = 0; i < 2; i++)
	{ 
		confusion[i] = new Array(2);
		for(var j = 0; j < 2; j++)
		{ confusion[i][j] = 0; }
	}
	//Genero matriz de confusion
	for(var i = 0; i < 100; i++)
	{ 
		if(i == 50){ origen = 1;}
		confusion[origen][ clasificados[i] ]++; 
	}

	probabilidad = ( confusion[0][0] + confusion[1][1] ) / 100;
	console.log("Probabilidad: "+probabilidad);
	clasificados.forEach(function(a){ console.log(a);});
	console.log(confusion);
	genera_tabla();
}
function myself()
{
	var xm = new Array(4);
	xm[0] = document.getElementById("x0").value;
	xm[1] = document.getElementById("x1").value;
	xm[2] = document.getElementById("x2").value;
	xm[3] = document.getElementById("x3").value;
	var r = Math.round( perceptron(xm,pesos) );
	console.log("Es de tipo: "+r);
}
function genera_tabla() {
  // Obtener la referencia del elemento body
  var body = document.getElementById("tabla");
 
  // Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");
 
  // Crea las celdas
  for (var i = 0; i < 100; i++) {
    // Crea las hileras de la tabla
    var hilera = document.createElement("tr");
 
    for (var j = 0; j < 2; j++) {
      // Crea un elemento <td> y un nodo de texto, haz que el nodo de
      // texto sea el contenido de <td>, ubica el elemento <td> al final
      // de la hilera de la tabla
      var celda = document.createElement("td");
      if(j==0){
      var textoCelda = document.createTextNode(" ["+x[i]+"]");}
      else{var textoCelda = document.createTextNode(""+clasificados[i]);}

      celda.appendChild(textoCelda);
      hilera.appendChild(celda);
    }
 
    // agrega la hilera al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(hilera);
  }
 
  // posiciona el <tbody> debajo del elemento <table>
  tabla.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tabla);
  // modifica el atributo "border" de la tabla y lo fija a "2";
  tabla.setAttribute("border", "2");
}