// This file configures Tailwind CSS.
// It's loaded before the main Tailwind script in the HTML to apply custom theme settings.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-blue': 'var(--brand-blue)',
        'brand-accent': 'var(--brand-accent)',
        'brand-dark': 'var(--brand-dark)',
        'brand-light-dark': 'var(--brand-light-dark)',
        'brand-text': 'var(--brand-text)',
        'brand-text-secondary': 'var(--brand-text-secondary)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
      }
    },
  },
};