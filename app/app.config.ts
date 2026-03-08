export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      secondary: 'blue',
      neutral: 'slate'
    },

    button: {
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-primary-500 hover:bg-primary/90 active:bg-primary/90'
        },
        {
          color: 'primary',
          variant: 'outline',
          class: 'ring-primary-500'
        }
      ]
    },
    skeleton: {
      base: 'animate-pulse rounded-md bg-default/10'
    }
  }
})
