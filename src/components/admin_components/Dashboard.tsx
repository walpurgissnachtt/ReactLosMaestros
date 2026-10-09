import {useState} from "react";

import SideBar from "./SideBar";
import './dashboard.css'
import martilloIcon from './assets/martillo.jpg';
export default function Dashboard(){
    const [currentTab, setActiveTab] = useState('listProduct')
    return(
        <div className="app-container">
            <SideBar 
            title={"Panel admin"}
            logo={martilloIcon}
            onSelectOption={(tab) => setActiveTab(tab)}/>
            <div id="option-selected-container">
                <p>Vista seleccionada: {currentTab}</p>
            </div>
        </div>
    )
}