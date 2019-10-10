import { FormGroup } from '@angular/forms'

// https://www.arduino.cc/reference/en/language/functions/math/map/
export const mapRange = (
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number => {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

// https://stackoverflow.com/a/2998874
export const zeroPad = (num, places) => {
  let zero = places - num.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}

export const clearUserName = (username: string): string => {
  return username.toLowerCase().trim()
}

export const passwordCriteria = (passwordKey: string): any => {
  return (group: FormGroup): { [key: string]: any } => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/gm

    const matches = regex.exec(group.controls[passwordKey].value)

    if (!matches) {
      return {
        weakPassword: true,
      }
    }
  }
}
