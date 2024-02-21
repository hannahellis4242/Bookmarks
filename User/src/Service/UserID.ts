export default interface UserID {
  t: "user";
  value: string;
}

export const userId=(id:string):UserID=>({t:"user",value:id});