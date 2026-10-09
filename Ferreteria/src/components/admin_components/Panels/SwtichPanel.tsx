import Inventory from "./Inventory";
import { Tabs } from "../Constants";
export const SwitchPanel = ({id} : {id:string})=>{
    switch(id){
        case Tabs.listarProductos:
            return <Inventory />
        default:
            break;
    }
}