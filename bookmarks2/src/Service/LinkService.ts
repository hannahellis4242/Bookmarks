import LinkID from "./LinkID";

export default interface LinkService{
    saveLink(url:string):Promise<LinkID>;
    getLinkID(url:string):Promise<LinkID>
}