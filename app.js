const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/DietPlannerDB", {useNewUrlParser: true, useUnifiedTopology: true});

const ingredientSchema = mongoose.Schema({
    name: String,
    ammount: Number,
    measure: String
});

const recipeSchema = mongoose.Schema({
    name: String,
    category: String,
    ingredients: [ingredientSchema],
    instructions: String
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

app.get("/", function(req, res) {
    res.send("DietPlanner API v1.0");
});

app.route("/recipe")

.get(function(req, res) {
    
})

.post(function(req, res) {
    const newIngredients = [];

    const recipeName = req.body.name;
    const recipeCat = req.body.category;

    const recipeIngredients = req.body.ingredients.split(",");
    let count = 1;
    let ingrName = "";
    let ingrAmm = 0;
    recipeIngredients.forEach(element => {
        switch (count) {
          case 1:
            ingrName = element;
            count++;
            break;
          case 2:
            ingrAmm = parseInt(element);
            count++;
            break;
          case 3:
            count = 1;
            newIngredients.push(
              new Ingredient({
                name: ingrName,
                ammount: ingrAmm,
                measure: element,
              })
            );
            break;
        }
    });

    console.log(newIngredients);
    const recipeInstructions = req.body.instructions;

    const recipe = new Recipe({
        name: recipeName,
        category: recipeCat,
        ingredients: newIngredients,
        instructions: recipeInstructions
    });

    console.log(recipe.ingredients);

    recipe.save(function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Recipe saved successfully.")
        }
    })

    console.log(req.body);
});

app.listen(3000, function() {
    console.log("Server listening on port 3000.");
});