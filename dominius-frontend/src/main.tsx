import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; //ignore l erreur de l import, c est normal, le fichier existe bien est c est  le bon nom

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Impossible de trouver l'élément root dans le DOM");
}