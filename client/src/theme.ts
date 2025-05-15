import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          value: "red"
        },
        bg: {
          value: "red"
        }
      }
    }
  }
})

export default createSystem(defaultConfig, config)