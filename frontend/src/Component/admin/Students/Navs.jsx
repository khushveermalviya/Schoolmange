import {useState} from 'react'
import { NavLink } from 'react-router-dom'
export default function Navs() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
 
   <div>
   <nav className="bg-white border-gray-200 dark:bg-gray-900">
     <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
       
       <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
         <button type="button" className="flex text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
           <span className="sr-only">Open user menu</span>
        
         </button>
         <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
          
           <ul className="py-2" aria-labelledby="user-menu-button">
             <li>
               <NavLink to='/admin' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Admin</NavLink>
             </li>
            
           </ul>
         </div>
         <button onClick={toggleMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded={isOpen}>
           <span className="sr-only">Open main menu</span>
           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
           </svg>
         </button>
       </div>
       <div className={`items-center justify-between ${isOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-user">
         <ul className=" flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
           <li>
             <NavLink to='add'  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page" >Add</NavLink>
           </li>
           <li>
             <NavLink to='delete'  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page" >Delete</NavLink>
           </li>
           <li>
             <NavLink to='annunosment'  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page" >Annunosment</NavLink>
           </li>
         
          
         </ul>
       </div>
     </div>
   </nav>
 </div>

  )
}
