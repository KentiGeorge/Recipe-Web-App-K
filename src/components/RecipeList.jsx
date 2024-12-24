import React from "react";
import "./RecipeList.css";

const RecipeList = ({ recipes, onSave }) => (
  <div className="recipe-list">
    {recipes.map((recipe) => (
      <div key={recipe.id} className="recipe-card">
        <h3>{recipe.title}</h3>
        {recipe.image && <img src={recipe.image} alt={recipe.title} />}
        <button onClick={() => onSave(recipe)}>Save to Favourites</button>
      </div>
    ))}
  </div>
);

export default RecipeList;

