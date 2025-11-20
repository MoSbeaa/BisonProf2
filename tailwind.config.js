// This file configures Tailwind CSS.
// It's loaded before the main Tailwind script in the HTML to apply custom theme settings.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-blue': 'var(--brand-blue)',
        'brand-dark': 'var(--brand-dark)',
        'brand-light-dark': 'var(--brand-light-dark)',
        'brand-text': 'var(--brand-text)',
        'brand-text-secondary': 'var(--brand-text-secondary)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};