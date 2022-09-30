import { PathLike } from "fs";

export interface Ports {
  secure: number;
  open: number;
}

export interface OptionsPaths {
  key: PathLike;
  cert: PathLike;
}

export default interface Configuration {
  ports: Ports;
  options: OptionsPaths;
}
