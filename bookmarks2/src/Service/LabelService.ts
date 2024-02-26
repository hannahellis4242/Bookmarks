import LabelID from "./LabelID";

export default interface LabelService{
    saveLabel(label:string):Promise<LabelID>;
    getLabelID(label:string):Promise<LabelID>;
    removeLabel(id:LabelID):Promise<void>;
}