/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: '#05040A',
        panel: '#120E24',
        panel2: '#1A1430',
        purple: { DEFAULT: '#8B5CF6', bright: '#A78BFA', deep: '#5B21B6' },
        blue: { DEFAULT: '#3B82F6', bright: '#60A5FA' },
        crimson: { DEFAULT: '#E11D48', bright: '#FB7185' },
        ink: { hi: '#F4F2FF', mid: '#A79FC9', low: '#6B6389' },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        head: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        nebula: 'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.2), transparent 45%), radial-gradient(circle at 50% 90%, rgba(225,29,72,0.15), transparent 40%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(139,92,246,0.35)',
        'glow-blue': '0 0 40px rgba(59,130,246,0.35)',
        'glow-crimson': '0 0 40px rgba(225,29,72,0.35)',
      },
    },
  },
  plugins: [],
}
