import type { Config } from "tailwindcss";

const {
	default: flattenColorPalette,
  } = require("tailwindcss/lib/util/flattenColorPalette");

const plugin = require("tailwindcss/plugin");

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			theme: {
  				primary: '#00DF81',    // Bright green
  				dark: '#032221',       // Dark teal
  				accent: '#03624C',     // Medium teal
  				light: '#2CC295',      // Light green
  				navy: '#000F81',       // Dark blue
  				background: '#F1F7F6',  // Light gray-green
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			"meteor": "meteor 5s linear infinite",
  			"shimmer": "shimmer 2s linear infinite",
  			"spotlight": "spotlight 2s ease .75s 1 forwards",
  			"float": "float 3s ease-in-out infinite",
  			"scroll-up": "scroll-up 40s linear infinite",
  			"scroll-down": "scroll-down 40s linear infinite",
  		},
  		keyframes: {
  			meteor: {
  				"0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
  				"70%": { opacity: "1" },
  				"100%": {
  					transform: "rotate(215deg) translateX(-500px)",
  					opacity: "0",
  				},
  			},
  			shimmer: {
  				from: {
  					backgroundPosition: "0 0",
  				},
  				to: {
  					backgroundPosition: "-200% 0",
  				},
  			},
  			spotlight: {
  				"0%": {
  					opacity: "0",
  					transform: "translate(-72%, -62%) scale(0.5)",
  				},
  				"100%": {
  					opacity: "1",
  					transform: "translate(-50%,-40%) scale(1)",
  				},
  			},
  			float: {
  				"0%, 100%": { transform: "translateY(0)" },
  				"50%": { transform: "translateY(-10px)" },
  			},
  			"scroll-up": {
  				"0%": { transform: "translateY(0)" },
  				"100%": { transform: "translateY(-50%)" },
  			},
  			"scroll-down": {
  				"0%": { transform: "translateY(-50%)" },
  				"100%": { transform: "translateY(0)" },
  			},
  		},
  	}
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors, plugin(({ addUtilities }: any) => {
    addUtilities({
      ".mask-radial-faded": {
        mask: "radial-gradient(circle at center, black 64%, transparent 100%)",
      },
      ".mask-linear-faded": {
        mask: "linear-gradient(black, transparent 70%)",
      },
      ".gradient-border": {
        border: "double 1px transparent",
        backgroundImage: "linear-gradient(var(--background), var(--background)), linear-gradient(to right, var(--primary), var(--secondary))",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      },
    });
  })],
};
export default config;

function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
	  Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);
   
	addBase({
	  ":root": newVars,
	});
  }
