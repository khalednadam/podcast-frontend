import React from 'react'
import Image from "next/image";

const Logo = () => {
    return (
        <Image src={'/khaled.webp'} alt="Logo" width={60} height={60} className="rounded-lg" />
    )
}
export default Logo
