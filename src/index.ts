import html from "./index.html";
import icon from "./assets/icon.svg";
import "./css/styles.css";
import "./ui/UI";
import { AppUI } from "./ui/AppUI";
import { Benchmark } from "./utils/Benchmark";
import { Lagrange } from "./engine/math/Lagrange";

// dirty way to get esbuild split out files
[html, icon].length;
document.body.add(AppUI);