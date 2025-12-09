/**
 * Bootstrap to Tailwind CSS Migration Script
 * Run this with: node scripts/bootstrap-to-tailwind.js
 */

const fs = require("fs");
const path = require("path");

// Define Bootstrap to Tailwind class mappings
const classMap = {
  // Layout
  container: "container mx-auto px-4",
  "d-flex": "flex",
  "d-block": "block",
  "d-none": "hidden",
  "d-inline": "inline",
  "d-inline-block": "inline-block",
  "d-grid": "grid",

  // Flexbox
  "justify-content-center": "justify-center",
  "justify-content-between": "justify-between",
  "justify-content-around": "justify-around",
  "justify-content-end": "justify-end",
  "justify-content-start": "justify-start",
  "align-items-center": "items-center",
  "align-items-start": "items-start",
  "align-items-end": "items-end",
  "flex-wrap": "flex-wrap",
  "flex-column": "flex-col",
  "flex-row": "flex-row",

  // Typography
  "text-center": "text-center",
  "text-left": "text-left",
  "text-right": "text-right",
  "text-muted": "text-gray-600",
  "text-primary": "text-primary-600",
  "text-secondary": "text-secondary-600",
  "text-success": "text-success-600",
  "text-danger": "text-danger-600",
  "text-warning": "text-warning-600",
  "text-info": "text-info-600",
  "text-dark": "text-gray-900",
  "text-white": "text-white",
  "text-capitalize": "capitalize",
  "text-lowercase": "lowercase",
  "text-uppercase": "uppercase",
  "fw-bold": "font-bold",
  "fw-semibold": "font-semibold",
  "fw-normal": "font-normal",
  "fw-light": "font-light",

  // Spacing (common ones)
  "mb-0": "mb-0",
  "mb-1": "mb-1",
  "mb-2": "mb-2",
  "mb-3": "mb-3",
  "mb-4": "mb-4",
  "mb-5": "mb-5",
  "mt-0": "mt-0",
  "mt-1": "mt-1",
  "mt-2": "mt-2",
  "mt-3": "mt-3",
  "mt-4": "mt-4",
  "mt-5": "mt-5",
  "me-1": "mr-1",
  "me-2": "mr-2",
  "me-3": "mr-3",
  "ms-1": "ml-1",
  "ms-2": "ml-2",
  "ms-3": "ml-3",
  "p-0": "p-0",
  "p-1": "p-1",
  "p-2": "p-2",
  "p-3": "p-3",
  "p-4": "p-4",
  "p-5": "p-5",

  // Grid
  row: "flex flex-wrap -mx-2",
  col: "px-2",
  "col-12": "w-full px-2",
  "col-6": "w-1/2 px-2",
  "col-4": "w-1/3 px-2",
  "col-3": "w-1/4 px-2",
  "col-md-12": "md:w-full px-2",
  "col-md-6": "md:w-1/2 px-2",
  "col-md-4": "md:w-1/3 px-2",
  "col-md-3": "md:w-1/4 px-2",
  "col-lg-12": "lg:w-full px-2",
  "col-lg-6": "lg:w-1/2 px-2",
  "col-lg-4": "lg:w-1/3 px-2",
  "col-lg-3": "lg:w-1/4 px-2",

  // Forms
  "form-control":
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
  "form-label": "block text-sm font-medium text-gray-700 mb-1",
  "form-check": "flex items-center",
  "form-check-input":
    "w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500",
  "form-check-label": "ml-2 text-sm text-gray-700",
  "is-invalid": "border-danger-500 focus:ring-danger-500",
  "invalid-feedback": "text-danger-600 text-sm mt-1",
  "form-text": "text-gray-500 text-sm mt-1",

  // Buttons
  "btn btn-primary":
    "px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500",
  "btn btn-secondary":
    "px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500",
  "btn btn-success":
    "px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500",
  "btn btn-danger":
    "px-4 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500",
  "btn btn-warning":
    "px-4 py-2 bg-warning-600 text-white rounded-md hover:bg-warning-700 focus:outline-none focus:ring-2 focus:ring-warning-500",
  "btn btn-dark":
    "px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700",
  "btn btn-outline-secondary":
    "px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500",
  "btn-close": "text-gray-400 hover:text-gray-900",

  // Badges
  "badge bg-primary":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800",
  "badge bg-success":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800",
  "badge bg-danger":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800",
  "badge bg-warning":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800",
  "badge bg-info":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800",
  "badge bg-secondary":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800",
  "badge rounded-pill": "rounded-full",

  // Cards
  card: "bg-white rounded-lg shadow",
  "card-header": "px-6 py-4 border-b border-gray-200",
  "card-body": "p-6",
  "card-footer": "px-6 py-4 border-t border-gray-200",
  "card-title": "text-xl font-semibold",

  // Spinners
  "spinner-border": "animate-spin rounded-full border-b-2",
  "spinner-border-sm": "h-4 w-4",
  "visually-hidden": "sr-only",

  // Other utilities
  "gap-1": "gap-1",
  "gap-2": "gap-2",
  "gap-3": "gap-3",
  "rounded-1": "rounded-sm",
  "rounded-pill": "rounded-full",
  shadow: "shadow",
  "shadow-sm": "shadow-sm",
  "shadow-lg": "shadow-lg",
};

function convertBootstrapToTailwind(content) {
  let converted = content;

  // Sort by length (longest first) to avoid partial replacements
  const entries = Object.entries(classMap).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [bootstrap, tailwind] of entries) {
    // Match className="..." patterns
    const escapedBootstrap = bootstrap.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `className="([^"]*\\s)?${escapedBootstrap}(\\s[^"]*)?\"`,
      "g"
    );
    converted = converted.replace(regex, (match, before = "", after = "") => {
      const combined = `${(before || "").trim()} ${tailwind} ${(
        after || ""
      ).trim()}`
        .replace(/\s+/g, " ")
        .trim();
      return `className="${combined}"`;
    });
  }

  return converted;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const converted = convertBootstrapToTailwind(content);

    if (content !== converted) {
      fs.writeFileSync(filePath, converted, "utf8");
      console.log(`✓ Converted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir, extensions = [".tsx", ".jsx", ".ts", ".js"]) {
  const files = fs.readdirSync(dir);
  let convertedCount = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        convertedCount += processDirectory(filePath, extensions);
      }
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      if (processFile(filePath)) {
        convertedCount++;
      }
    }
  }

  return convertedCount;
}

// Run the conversion
console.log("Starting Bootstrap to Tailwind CSS migration...\n");
const appDir = path.join(__dirname, "..", "app");
const convertedCount = processDirectory(appDir);
console.log(`\n✓ Migration complete! Converted ${convertedCount} files.`);
console.log("\nPlease review the changes and test thoroughly.");
