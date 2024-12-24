import React from "react";
import { motion } from "framer-motion";
import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
  return (
    <motion.div
      className="recipe-card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {recipe.image && <img src={recipe.image} alt={recipe.title} />}
      <h3>{recipe.title}</h3>
      {recipe.summary ? (
        <p dangerouslySetInnerHTML={{ __html: recipe.summary.slice(0, 100) + "..." }} />
      ) : (
        <p>No description available.</p>
      )}
      {recipe.sourceUrl && (
        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
          View Full Recipe
        </a>
      )}
    </motion.div>
  );
};

export default RecipeCard;
