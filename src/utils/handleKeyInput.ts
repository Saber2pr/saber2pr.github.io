import { origin } from '../config'

export const handleKeyInput = (input: string) => {
  if (input === 'disable iv') {
    localStorage.setItem(origin.constants.disable_iv, 'true')
  }
  if (input === 'enable iv') {
    localStorage.removeItem(origin.constants.disable_iv)
  }
}
