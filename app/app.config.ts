export default defineAppConfig({
  modules: ['@nuxt/image'],
  ui: {
    colors: {
      primary: 'orange',
      secondary: 'blue',
      neutral: 'slate',
    },

    button: {
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-primary-500 hover:bg-primary/90 active:bg-primary/90',
        },
        {
          color: 'primary',
          variant: 'outline',
          class: 'ring-primary-500',
        },
      ],
    },
    skeleton: {
      // bg-accented, não bg-default: o fundo padrão é branco, e a 10% de opacidade
      // sobre a página branca o skeleton fica invisível.
      // motion-reduce: a pulsação é decorativa e incomoda quem pediu menos movimento.
      base: 'animate-pulse motion-reduce:animate-none rounded-md bg-accented',
    },
  },
})
