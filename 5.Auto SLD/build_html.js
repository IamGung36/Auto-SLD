const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'bundle.js');
const outputPath = path.join(__dirname, 'index.html');

if (!fs.existsSync(bundlePath)) {
  console.error("bundle.js not found!");
  process.exit(1);
}

const bundleJs = fs.readFileSync(bundlePath, 'utf-8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SLD STUDIO Pro - Solar Design Tool</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com/"></script>
    <script>
        tailwind.config = {
            darkMode: ["class"],
            theme: {
                container: {
                    center: true,
                    padding: "2rem",
                    screens: {
                        "2xl": "1400px",
                    },
                },
                extend: {
                    colors: {
                        border: "hsl(var(--border))",
                        input: "hsl(var(--input))",
                        ring: "hsl(var(--ring))",
                        background: "hsl(var(--background))",
                        foreground: "hsl(var(--foreground))",
                        primary: {
                            DEFAULT: "hsl(var(--primary))",
                            foreground: "hsl(var(--primary-foreground))",
                        },
                        secondary: {
                            DEFAULT: "hsl(var(--secondary))",
                            foreground: "hsl(var(--secondary-foreground))",
                        },
                        destructive: {
                            DEFAULT: "hsl(var(--destructive))",
                            foreground: "hsl(var(--destructive-foreground))",
                        },
                        muted: {
                            DEFAULT: "hsl(var(--muted))",
                            foreground: "hsl(var(--muted-foreground))",
                        },
                        accent: {
                            DEFAULT: "hsl(var(--accent))",
                            foreground: "hsl(var(--accent-foreground))",
                        },
                        popover: {
                            DEFAULT: "hsl(var(--popover))",
                            foreground: "hsl(var(--popover-foreground))",
                        },
                        card: {
                            DEFAULT: "hsl(var(--card))",
                            foreground: "hsl(var(--card-foreground))",
                        },
                    },
                    borderRadius: {
                        lg: "var(--radius)",
                        md: "calc(var(--radius) - 2px)",
                        sm: "calc(var(--radius) - 4px)",
                    },
                },
            },
        }
    </script>
    
    <!-- React & ReactDOM CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
</head>
<body class="bg-slate-900 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
    
    <div id="app-root" class="h-screen w-screen overflow-hidden"></div>

    <script>
        // Ensure React and ReactDOM are globally available
        if (!window.React || !window.ReactDOM) {
            document.write('<div style="color:red;padding:20px;font-family:sans-serif">Failed to load React from CDN. Please check your internet connection.</div>');
            throw new Error('React or ReactDOM is not loaded!');
        }
        
        // Define simple require shim for the esbuild bundle
        window.require = function(moduleName) {
            if (moduleName === 'react') return window.React;
            if (moduleName === 'react-dom') return window.ReactDOM;
            throw new Error('Module ' + moduleName + ' not shimmed.');
        };
    </script>

    <!-- Compiled React App Bundle -->
    <script>
        ${bundleJs}
    </script>

    <!-- Render the App -->
    <script>
        // Render the main component
        // Note: esbuild IIFE exports to global name AppBundle, which has export default or exports App
        const App = AppBundle.default || AppBundle;
        ReactDOM.render(React.createElement(App), document.getElementById('app-root'));
    </script>
</body>
</html>`;

fs.writeFileSync(outputPath, htmlContent, 'utf-8');
console.log(`Successfully generated index.html at ${outputPath}`);
