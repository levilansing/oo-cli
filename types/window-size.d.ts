declare module "window-size" {
  /** Height of the terminal window.*/
  export const height: number;

  /** Width of the terminal window.*/
  export const width: number;

  export function get(): {width: number, height: number};
}
