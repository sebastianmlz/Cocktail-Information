//imports
import express  from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

//creating the app
const app = express();
const port = 3000;
const urlAPI = "https://www.thecocktaildb.com/api/json/v1/1/";

//using middlewears
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


//ir a la ruta de inicio
app.get('/',async (req, res) => {
    var secret = '';
    res.render("index.ejs",{secret});
});

//funcion para asegurar que la primer letra de cada palabra este en mayuscula
function capitalizeWords(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i === 0 || str.charAt(i - 1) === ' ') {
            // Si es el primer carácter o está precedido por un espacio
            result += str.charAt(i).toUpperCase();
        } else {
            // De lo contrario, añadir el carácter tal cual
            result += str.charAt(i).toLowerCase();
        }
    }
    return result;
}

//ir a la ruta de inicio con el resultado de la busqueda byName
app.get('/byName', async (req, res) => {
    const name = capitalizeWords(req.query.name);
    try {
        const response = await axios.get(`${urlAPI}search.php?s=${name}` );
        const content = response.data.drinks;
        var resultado ;
        for(let i=0; i < content.length ; i++){
            if(name === content[i].strDrink){
                resultado = content[i];
            }
        }
        res.render("index.ejs", {result:resultado});
    } catch (error) {
        console.log(error);
        const secret = "Nothing found";
        res.render("index.ejs", {secret});
    }
})

//ir a la ruta de inicio con el resultado de la busqueda byFirst
app.get('/byFirst', async(req, res) => {
    const letter = capitalizeWords(req.query.first);
    try {
        const response = await axios.get(`${urlAPI}search.php?f=${letter}`);
        const result = response.data.drinks;
        console.log(result);
        res.render("index.ejs",{result});
    } catch(error) {
        console.log(error);
        const secret = "Nothing found";
        res.render("index.ejs", {secret});
    }
})

//ir a la ruta de inicio con el resultado de la busqueda byRandom
app.get('/random', async(req, res) => {
    try {
        const response = await axios.get(urlAPI + "random.php");
        const result = response.data.drinks[0];
        res.render("index.ejs", {result});
    } catch(error) {
        console.log(error);
        const secret = "Nothing found";
        res.render("index.ejs", {secret});
    }
})


//Listen on the predefined port and start the server.
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})