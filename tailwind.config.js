// This file configures Tailwind CSS.
// It's loaded before the main Tailwind script in the HTML to apply custom theme settings.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563EB',
        'brand-dark': '#0F172A',
        'brand-light-dark': '#1E293B',
        'brand-text': '#E2E8F0',
        'brand-text-secondary': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
