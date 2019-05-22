function genetico()
{
	console.log("calculando...");
	//Generaciones para generar poblaciones
	generaciones = 20;
	//Elementos que tiene la poblacion
	elementos = 100;
	//Numero de caracteristicas
	features = 4;
	//Numero de neuronas
	neurons = 6;
	//Elitismo para seleccion de padres
	elite = 0.5;
	//Tipo de seleccion para padres en cruza
	select = 0;
	//Numero de bits para numeros en matrices
	bits = 6;
	//Seleccionadores para que la red neuronal te devuelva el error o solo clasifique
	genera_error = true;
	//Mejor matriz clasificadora
	best = new Array();
	//Pobladores más aptos de cada poblacion
	var aptos = [];
	
	//Población inicial
	var poblacion = create_town(elementos,neurons,features,bits);
	//Genetico
	for(var i = 0; i < generaciones; i++)
	{
		var cruzada = cruza(poblacion,select,bits,elite);
		var mutada = mutacion(cruzada,bits);
		//Ordenar por error de menor a mayor
		mutada.sort( function(a,b){return a.error - b.error} );
		poblacion = mutada;
		//Guardar la que tenga el error mínimo de la poblacion
		aptos.push( poblacion[0] );
	}
	
	//Ordenar los mas aptos
	aptos.sort( function(a,b){ return a.error - b.error; });
	//Copio los pesos de la mejor matriz de pesos
	for(var i = 0;i < aptos[0].pesos.length; i++)
		{ best.push( aptos[0].pesos[i] ); }
	return best;
}

//Creo poblacion de pesos. Cada poblador tiene W1 y W2
function create_town(elementos, neurons,features,bits)
{
	var town = new Array();
	//Creo población inicial
	for(var k = 0; k < elementos; k++)
	{
		var poblador = {pesos: [], error: 0};
		//Genero valores para la matriz de pesos w1. Rango [0-(2^bits -1)]
		for(var i = 0; i < features*neurons; i++)
		{
			var peso = parseInt( Math.random() * 


				(1 << bits) );
			//Agrego los pesos al vector del poblador
			poblador.pesos.push( peso );
		}
		//Genero valores para la matriz de pesos w2. Rango [0-(2^bits -1)]
		for(var i = 0; i < neurons; i++)
		{
			var valor = parseInt( Math.random() * (1 << bits) );
			//Agrego los pesos al vector del poblador
			poblador.pesos.push(valor);
		}

		poblador.error = red(poblador.pesos);
		town.push(poblador);
	}
	return town;
}

//Cruza de pobladores para crear nueva poblacion
function cruza(poblation,selection,bits,elite)
{
	//console.log(poblation);
	var indice1 = null;
	var indice2 = null;
	var new_town = new Array();
	var elementos = poblation.length;
	var k = 0;

	while(k < (elementos/2))
	{
		//Selección de dos padres
		switch(selection)
		{
			case 0:
				//Torneo
				do
				{
					indice1 = parseInt(torneo(poblation,elite));
					indice2 = parseInt(torneo(poblation,elite));
				}while(indice1 == indice2);
				break;
			case 1: 
				//Ranking
			case 2:
				//Aleatorio
				do
				{
					indice1 = parseInt(Math.random() * elementos * elite);
					indice2 = parseInt(Math.random() * elementos * elite);
				} while(indice1 == indice2);
				break;
		}
		//-----------PADRES------------//
		var padre1 = poblation[indice1];
		var padre2 = poblation[indice2];
		//-------------SELECCIÓN DE MASCARAS--------------//
		var mascaraIzq = mascaras(bits,0);
		var mascaraDer = mascaras(bits,1);
		var numMasc = null;
		//---------------HIJOS-----------------//
		let hijo_1 = {pesos: [],error:0};
		let hijo_2 = {pesos: [],error:0};
		//Cruzamos todos los elemento de los pesos
		for(var i = 0; i < padre1.pesos.length; i++)
		{
			var a = padre1.pesos[i]; 
			var b = padre2.pesos[i];
			//Escogemos mascara que este entre la posicion [1,bits-1] del arreglo
			numMasc = parseInt( Math.random() * (bits-1) + 1 );
			//console.log("Mascara "+i+": "+numMasc);
			hijo_1.pesos.push( (a & mascaraIzq[numMasc]) | (b & mascaraDer[numMasc]) );
			hijo_2.pesos.push( (b & mascaraIzq[numMasc]) | (a & mascaraDer[numMasc]) );			
		}
		hijo_1.error = red(hijo_1.pesos);
		hijo_2.error = red(hijo_2.pesos);
		new_town.push(hijo_1);
		new_town.push(hijo_2);
		k++;
	} 
	return new_town;
}
function mutacion(pobla,bits)
{
	let elementos = pobla.length;
	var mutados = new Array();
	//Creo una copia de la población para mutarla
	for(var i = 0; i < elementos; i++)
		{mutados.push( pobla[i] );}

	//Recorro la población
	for(var i = 0; i < elementos; i++)
	{
		let pm = Math.random(); //Probabilidad de mutacion
		let mutar_bit = null;
		if(pm > 0.5)
		{
			//console.log(i+" es mutante");
			//Muto los pesos en un bit diferente cada uno 
			for(var j = 0; j < mutados[i].pesos.length; j++)
			{
				mutar_bit = parseInt(Math.random() * bits);
				//console.log("mutar en bit: "+mutar_bit);
				//console.log(""+mutados[i].pesos[j]);
				mutados[i].pesos[j] ^= (1 << mutar_bit);
				//console.log(""+mutados[i].pesos[j]);				
			}
			mutados[i].error = red(mutados[i].pesos);
		}
	}
	return mutados;
}
/*Funcion que genera mascaras*/
function mascaras(bits,lado)
{
	let mask = new Array();
	let num = null;
	/*Izquierda*/
	if(lado == 0)
	{
		num = (1 << bits) - 1; 
		mask.push(num);
		for(var i = 0; i < bits; i++)
		{
			num -=  1 << i;
			mask.push(num);	
		}
	}
	/*Derecha*/
	if(lado == 1)
	{
		num = 0;
		mask.push(num);
		for(var i = 0; i < bits; i++)
		{
			num += 1 << i;
			mask.push(num);
		}
	}
	return mask;
}
//Funcion torneo regresa el indice del valor mas pequeñO
function torneo(pobla,elitis)
{
	let tam = pobla.length;
	let ganador = tam;
	let enfrentamientos = 5;
	for(var i=0; i < enfrentamientos;i++)
	{
		let peleador = Math.random() * tam * elitis;
		if(peleador < ganador)
			ganador = peleador;
	}
	return parseInt(ganador);
}

/*bit a flotante.Resultado entre rango*/
function toFloat(coeficiente,bits)
{
	let maximo = 10
	let minimo = -10
	let rango = maximo - minimo;
	let delta = rango / ( (1 << bits) -1);
	return delta * coeficiente + minimo;

}