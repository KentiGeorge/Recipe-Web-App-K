import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import RecipeList from "./components/RecipeList";
import "./App.css";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const navigate = useNavigate();

  const fetchRecipes = async () => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=f31d6f1d43cd483e9bdb1525ad5ee494&query=${query}&number=10&offset=${(page - 1) * 10}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecipes(data.results || []);
      setTotalResults(data.totalResults || 0);
    } catch (error) {
      setError("Error fetching recipes. Please try again later.");
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchRecipes();
  }, [page]);

  const handleAddRecipeClick = () => {
    navigate("/add-recipe");
  };

  const saveToFavourites = (recipe) => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    favourites.push(recipe);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    alert("Recipe added to favourites!");
  };

  const handleNextPage = () => {
    if (page < Math.ceil(totalResults / 10)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 onClick={() => window.location.reload()}>RATATOUILLE RECIPES</h1>
      </nav>
      <div className="landing-page">
        <h2>Discover Delicious Recipes</h2>
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-bar"
        />
        <button onClick={() => { setPage(1); fetchRecipes(); }} className="search-button">
          Search
        </button>
      </div>
      {isLoading ? (
        <div className="loader"></div>
      ) : error ? (
        <p>{error}</p>
      ) : recipes.length > 0 ? (
        <>
          <RecipeList recipes={recipes} onSave={saveToFavourites} />
          <div className="pagination-buttons">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <button onClick={handleNextPage} disabled={page >= Math.ceil(totalResults / 10)}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No recipes found.</p>
      )}
      <div>
        <button className="add-recipe-button" onClick={handleAddRecipeClick}>
          Add a New Recipe
        </button>
      </div>
    </div>
  );
};

const AddRecipeForm = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !ingredients || !instructions) {
      alert("All fields are required!");
      return;
    }
    const newRecipe = { title, ingredients, instructions };
    onAdd(newRecipe);
    setTitle("");
    setIngredients("");
    setInstructions("");
    onClose();
  };

  return (
    <div className="add-recipe-form">
      <h3>Add a New Recipe</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <textarea
          placeholder="Cooking Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <button type="submit">Add Recipe</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

const AddRecipe = () => {
  const handleAddRecipe = (newRecipe) => {
    const customRecipes = JSON.parse(localStorage.getItem("customRecipes")) || [];
    customRecipes.push(newRecipe);
    localStorage.setItem("customRecipes", JSON.stringify(customRecipes));
    alert("Recipe added successfully!");
  };

  const handleCloseForm = () => {
    window.history.back(); // Navigate back to the homepage or previous page
  };

  return (
    <div>
      <AddRecipeForm onAdd={handleAddRecipe} onClose={handleCloseForm} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
