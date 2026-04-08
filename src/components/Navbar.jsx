import { NavLink } from "react-router-dom";

function Navbar(){
    const linkBase ="rounded-lg px-3 py-2 text-sm font-medium transition-colors";
    const activeLink = "bg-slate-900 text-white";
    const inactiveLink = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

    return(
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">LessonPlanner</h1>
                </div>

                <div className="flex items-center gap-2">
                    <NavLink
                        to="/"
                        end
                        className={({isActive}) => 
                            `${linkBase} ${isActive ? activeLink : inactiveLink}`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/map"
                        className={({isActive}) => 
                            `${linkBase} ${isActive ? activeLink : inactiveLink}`
                        }
                    >
                        Map Curriculum
                    </NavLink>

                    <NavLink
                        to="/upload"
                        className={({isActive}) => 
                            `${linkBase} ${isActive ? activeLink : inactiveLink}`
                        }
                    >
                        Upload Curriculum
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;