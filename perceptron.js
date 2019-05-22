function red(pesos)
{
	//Vector de flores clasificadas
	clasificados = new Array(100);
	//Vector de caracteristicas. Rango: [0,1]
	var x = load_data();
	//Etiqueta para diferenciar flor
	var etiqueta = 0;
	//Error total de la red neuronal
	var error = 0;

	for(var k = 0; k < 100;k++)
	{
		if(k == 50){etiqueta = 1;}
		//Cálculo de sigma con red neuronal
		var sig = perceptron(x[k],pesos);
		//Respaldo del resultado de cada caracteristica. QUIERO EL ULTIMO QUE GENERA
		clasificados[k]=sig;
		error += Math.abs( (etiqueta - sig) );
	}
	return error;
}
function perceptron(x,pesos)
{
	//Vector de capa s1
	var s1 = new Array(neurons);
	//Escalar de capa s2
	var s2 = 0;
	//Generamos matrices de pesos a partir del vector pesos
	var w1 = make_mat(pesos,0);
	var w2 = make_mat(pesos,1);

	//CALCULO DE TRANSPUESTA DE UNA MATRIZ
		//Vuelvo cadena una matriz
	var matStr = mat2str(w1); //Formato: [a,b;c,d]
		//Calculo transpuesta de la matriz w1
	var transpuesta = math.eval('transpose('+matStr+')')._data; //._data para obetener solo la matriz

	//Optener valores de capa oculta s1 y para s2
	for(var i = 0; i < neurons; i++)
	{
		s1[i] = 0;
		for(var j = 0; j < features; j++)
		{
			s1[i] += x[j] * transpuesta[i][j]; //Xi * W1 
		}
		s2 += sigmoide( s1[i] ) * w2[i];
	}
	var sigma = sigmoide(s2);
	return sigma;
}
function sigmoide(x)
{
	return 1 / (1 + Math.pow(Math.E,-1*x));
}
//De un vector extrae datos y genera dos matrices. Seleccion: 0 -> w1|1 -> w2
function make_mat(pesos,seleccion)
{
	//Creo matrices de pesos
	var w1 = new Array(features);
	var w2 = new Array();
	//Genero matriz vacia. PARA SOLO ACCEDER A SUS CAMPOS
	for(var i = 0; i < features; i++)
		{ w1[i] = new Array(neurons); }
	//W1
	var k = 0;
	for(var i = 0; i < features; i++ )
	{
		for(var j = 0; j < neurons; j++ )
		{
			w1[i][j] = toFloat( pesos[k],bits );
			k++;
		}
	}
	//W2
	for(var i = 0; i < neurons; i++)
		{ w2.push( toFloat(pesos[i+k],bits) ); }
	if(seleccion == 0){return w1;}
	return w2;
}
//Convierte una matriz a string con el siguiente formato. [1,2;3,4]
function mat2str(matriz)
{
	var cad = "[";
	matriz.forEach(	function(a,b,c){ cad += a.toString();if(b != c.length-1){cad+=";";}	} );
	cad += "]";
	return cad;
}
function load_data()
{
	//Cantidad de datos
	var cantidad = 100;
	//Almacenar transpuesta normalizada
	var normalizados = new Array(4);
	//Cargo vector de datos
	var datos = data();

	//===========PROCESO DE NORMALIZACION POR COLUMNA==========//
	//--Se transpone la matriz de datos para que trabajar por columna sea sencillo
	//--luego se vuelve a transponer para dejar los valores como estaban	

	//Matriz a cadena
	var matStr = mat2str(datos); //Formato: [a,b;c,d]
	//Calculo transpuesta de la matriz w1 con Math.js
	var transpuesta = math.eval('transpose('+matStr+')')._data; //._data para obetener solo la matriz
	
	//NORMALIZACIÓN
	for(i = 0; i < transpuesta.length ; i++)
	{
		var maximo = Math.max(...transpuesta[i]); 
		var minimo = Math.min(...transpuesta[i]);
		normalizados[i] = new Array(cantidad);
		for(j = 0; j < transpuesta[i].length; j++)
		{
			//Valor entre [0,1]
			normalizados[i][j] = (transpuesta[i][j] - minimo) / (maximo - minimo);	
		}
	}
	//Matriz a cadena
	var matStr = mat2str(normalizados); //Formato: [a,b;c,d]
	//Calculo transpuesta de la matriz w1
	var datos_normalizados = math.eval('transpose('+matStr+')')._data; //._data para obetener solo la matriz
	return datos_normalizados;
}
//Funcion que devuelve una matriz con 100 datos  de Iris
function data()
{
	var excel = 
		[	
		[	5.1	,	3.5	,	1.4	,	0.2	],
		[	4.9	,	3	,	1.4	,	0.2	],
		[	4.7	,	3.2	,	1.3	,	0.2	],
		[	4.6	,	3.1	,	1.5	,	0.2	],
		[	5	,	3.6	,	1.4	,	0.2	],
		[	5.4	,	3.9	,	1.7	,	0.4	],
		[	4.6	,	3.4	,	1.4	,	0.3	],
		[	5	,	3.4	,	1.5	,	0.2	],
		[	4.4	,	2.9	,	1.4	,	0.2	],
		[	4.9	,	3.1	,	1.5	,	0.1	],
		[	5.4	,	3.7	,	1.5	,	0.2	],
		[	4.8	,	3.4	,	1.6	,	0.2	],
		[	4.8	,	3	,	1.4	,	0.1	],
		[	4.3	,	3	,	1.1	,	0.1	],
		[	5.8	,	4	,	1.2	,	0.2	],
		[	5.7	,	4.4	,	1.5	,	0.4	],
		[	5.4	,	3.9	,	1.3	,	0.4	],
		[	5.1	,	3.5	,	1.4	,	0.3	],
		[	5.7	,	3.8	,	1.7	,	0.3	],
		[	5.1	,	3.8	,	1.5	,	0.3	],
		[	5.4	,	3.4	,	1.7	,	0.2	],
		[	5.1	,	3.7	,	1.5	,	0.4	],
		[	4.6	,	3.6	,	1	,	0.2	],
		[	5.1	,	3.3	,	1.7	,	0.5	],
		[	4.8	,	3.4	,	1.9	,	0.2	],
		[	5	,	3	,	1.6	,	0.2	],
		[	5	,	3.4	,	1.6	,	0.4	],
		[	5.2	,	3.5	,	1.5	,	0.2	],
		[	5.2	,	3.4	,	1.4	,	0.2	],
		[	4.7	,	3.2	,	1.6	,	0.2	],
		[	4.8	,	3.1	,	1.6	,	0.2	],
		[	5.4	,	3.4	,	1.5	,	0.4	],
		[	5.2	,	4.1	,	1.5	,	0.1	],
		[	5.5	,	4.2	,	1.4	,	0.2	],
		[	4.9	,	3.1	,	1.5	,	0.1	],
		[	5	,	3.2	,	1.2	,	0.2	],
		[	5.5	,	3.5	,	1.3	,	0.2	],
		[	4.9	,	3.1	,	1.5	,	0.1	],
		[	4.4	,	3	,	1.3	,	0.2	],
		[	5.1	,	3.4	,	1.5	,	0.2	],
		[	5	,	3.5	,	1.3	,	0.3	],
		[	4.5	,	2.3	,	1.3	,	0.3	],
		[	4.4	,	3.2	,	1.3	,	0.2	],
		[	5	,	3.5	,	1.6	,	0.6	],
		[	5.1	,	3.8	,	1.9	,	0.4	],
		[	4.8	,	3	,	1.4	,	0.3	],
		[	5.1	,	3.8	,	1.6	,	0.2	],
		[	4.6	,	3.2	,	1.4	,	0.2	],
		[	5.3	,	3.7	,	1.5	,	0.2	],
		[	5	,	3.3	,	1.4	,	0.2	],
		[	7	,	3.2	,	4.7	,	1.4	],
		[	6.4	,	3.2	,	4.5	,	1.5	],
		[	6.9	,	3.1	,	4.9	,	1.5	],
		[	5.5	,	2.3	,	4	,	1.3	],
		[	6.5	,	2.8	,	4.6	,	1.5	],
		[	5.7	,	2.8	,	4.5	,	1.3	],
		[	6.3	,	3.3	,	4.7	,	1.6	],
		[	4.9	,	2.4	,	3.3	,	1	],
		[	6.6	,	2.9	,	4.6	,	1.3	],
		[	5.2	,	2.7	,	3.9	,	1.4	],
		[	5	,	2	,	3.5	,	1	],
		[	5.9	,	3	,	4.2	,	1.5	],
		[	6	,	2.2	,	4	,	1	],
		[	6.1	,	2.9	,	4.7	,	1.4	],
		[	5.6	,	2.9	,	3.6	,	1.3	],
		[	6.7	,	3.1	,	4.4	,	1.4	],
		[	5.6	,	3	,	4.5	,	1.5	],
		[	5.8	,	2.7	,	4.1	,	1	],
		[	6.2	,	2.2	,	4.5	,	1.5	],
		[	5.6	,	2.5	,	3.9	,	1.1	],
		[	5.9	,	3.2	,	4.8	,	1.8	],
		[	6.1	,	2.8	,	4	,	1.3	],
		[	6.3	,	2.5	,	4.9	,	1.5	],
		[	6.1	,	2.8	,	4.7	,	1.2	],
		[	6.4	,	2.9	,	4.3	,	1.3	],
		[	6.6	,	3	,	4.4	,	1.4	],
		[	6.8	,	2.8	,	4.8	,	1.4	],
		[	6.7	,	3	,	5	,	1.7	],
		[	6	,	2.9	,	4.5	,	1.5	],
		[	5.7	,	2.6	,	3.5	,	1	],
		[	5.5	,	2.4	,	3.8	,	1.1	],
		[	5.5	,	2.4	,	3.7	,	1	],
		[	5.8	,	2.7	,	3.9	,	1.2	],
		[	6	,	2.7	,	5.1	,	1.6	],
		[	5.4	,	3	,	4.5	,	1.5	],
		[	6	,	3.4	,	4.5	,	1.6	],
		[	6.7	,	3.1	,	4.7	,	1.5	],
		[	6.3	,	2.3	,	4.4	,	1.3	],
		[	5.6	,	3	,	4.1	,	1.3	],
		[	5.5	,	2.5	,	4	,	1.3	],
		[	5.5	,	2.6	,	4.4	,	1.2	],
		[	6.1	,	3	,	4.6	,	1.4	],
		[	5.8	,	2.6	,	4	,	1.2	],
		[	5	,	2.3	,	3.3	,	1	],
		[	5.6	,	2.7	,	4.2	,	1.3	],
		[	5.7	,	3	,	4.2	,	1.2	],
		[	5.7	,	2.9	,	4.2	,	1.3	],
		[	6.2	,	2.9	,	4.3	,	1.3	],
		[	5.1	,	2.5	,	3	,	1.1	],
		[	5.7	,	2.8	,	4.1	,	1.3	],
		[	6.3	,	3.3	,	6	,	2.5	],
		[	5.8	,	2.7	,	5.1	,	1.9	],
		[	7.1	,	3	,	5.9	,	2.1	],
		[	6.3	,	2.9	,	5.6	,	1.8	],
		[	6.5	,	3	,	5.8	,	2.2	],
		[	7.6	,	3	,	6.6	,	2.1	],
		[	4.9	,	2.5	,	4.5	,	1.7	],
		[	7.3	,	2.9	,	6.3	,	1.8	],
		[	6.7	,	2.5	,	5.8	,	1.8	],
		[	7.2	,	3.6	,	6.1	,	2.5	],
		[	6.5	,	3.2	,	5.1	,	2	],
		[	6.4	,	2.7	,	5.3	,	1.9	],
		[	6.8	,	3	,	5.5	,	2.1	],
		[	5.7	,	2.5	,	5	,	2	],
		[	5.8	,	2.8	,	5.1	,	2.4	],
		[	6.4	,	3.2	,	5.3	,	2.3	],
		[	6.5	,	3	,	5.5	,	1.8	],
		[	7.7	,	3.8	,	6.7	,	2.2	],
		[	7.7	,	2.6	,	6.9	,	2.3	],
		[	6	,	2.2	,	5	,	1.5	],
		[	6.9	,	3.2	,	5.7	,	2.3	],
		[	5.6	,	2.8	,	4.9	,	2	],
		[	7.7	,	2.8	,	6.7	,	2	],
		[	6.3	,	2.7	,	4.9	,	1.8	],
		[	6.7	,	3.3	,	5.7	,	2.1	],
		[	7.2	,	3.2	,	6	,	1.8	],
		[	6.2	,	2.8	,	4.8	,	1.8	],
		[	6.1	,	3	,	4.9	,	1.8	],
		[	6.4	,	2.8	,	5.6	,	2.1	],
		[	7.2	,	3	,	5.8	,	1.6	],
		[	7.4	,	2.8	,	6.1	,	1.9	],
		[	7.9	,	3.8	,	6.4	,	2	],
		[	6.4	,	2.8	,	5.6	,	2.2	],
		[	6.3	,	2.8	,	5.1	,	1.5	],
		[	6.1	,	2.6	,	5.6	,	1.4	],
		[	7.7	,	3	,	6.1	,	2.3	],
		[	6.3	,	3.4	,	5.6	,	2.4	],
		[	6.4	,	3.1	,	5.5	,	1.8	],
		[	6	,	3	,	4.8	,	1.8	],
		[	6.9	,	3.1	,	5.4	,	2.1	],
		[	6.7	,	3.1	,	5.6	,	2.4	],
		[	6.9	,	3.1	,	5.1	,	2.3	],
		[	5.8	,	2.7	,	5.1	,	1.9	],
		[	6.8	,	3.2	,	5.9	,	2.3	],
		[	6.7	,	3.3	,	5.7	,	2.5	],
		[	6.7	,	3	,	5.2	,	2.3	],
		[	6.3	,	2.5	,	5	,	1.9	],
		[	6.5	,	3	,	5.2	,	2	],
		[	6.2	,	3.4	,	5.4	,	2.3	],
		[	5.9	,	3	,	5.1	,	1.8	]
		];
	var datos = new Array(100);
	for(var i = 0; i < 100; i++)
	{
		datos[i] = new Array(4);
		for(var j = 0; j < 4;j++)
		{	datos[i][j] = excel[i][j]; }
	}
	return datos;
}

