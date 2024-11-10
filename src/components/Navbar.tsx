import Link from "next/link"
import React from "react"


const Navbar = () => {
    return( 
    <nav className="border-b bg-background w-full flex items-center">
        <div>
            <Link href="/" className="font-bold">Home</Link>
            <div>
            <Link href="/middleware" className="flex items-center">Middleware</Link>
            </div>
        </div>
    </nav>
    )
}

export default Navbar