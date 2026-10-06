import { businessNavItems, miscNavItems } from "./Constants";
import { useState } from "react";
import './dashboard.css';
interface SideBarProps {
  title: string;
  logo: string;
  onSelectOption: (id: string) => void;
}
export default function SideBar({logo,title,onSelectOption}: SideBarProps){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <aside className="options-aside-panel-container">
            <button 
            className="menu-toggle" 
            type="button" 
            aria-label="Abrir menú" 
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className="options"
            aria-label="Business Navigation">
                <div className="header">
                    <img src={logo} alt="icon" className="company-icon"/> 
                    <h1 className="company-name">{title}</h1>
                </div>
                <div className="business-options">
                    <ul>
                        {businessNavItems.map((item) =>(
                            <li key={item.id}>
                                <button className="bopt" id={item.id} type="button" onClick={()=>onSelectOption(item.id)}>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="miscellaneous-options">
                    <ul>
                        {miscNavItems.map((item)=>(
                            <li key={item.id}>
                                <button className="mopt" id={item.id} type="button" onClick={()=>onSelectOption(item.id)}>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </aside>
    )
}