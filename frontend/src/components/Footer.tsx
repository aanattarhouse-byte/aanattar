"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
FaInstagram,
FaFacebookF,
FaEnvelope,
FaPhoneAlt
} from "react-icons/fa";

export default function Footer() {

const currentYear = new Date().getFullYear();

const footerLinks = [
{
title:"Support",
links:[
{label:"Contact",href:"/contact"},
],
},
{
title:"Legal",
links:[
{label:"Privacy",href:"/privacy"},
{label:"Terms",href:"/terms"},
{label:"Cookies",href:"/cookies"},
],
},
];

return (
<motion.footer
initial={{opacity:0}}
whileInView={{opacity:1}}
transition={{duration:.8}}
viewport={{once:true}}
className="
relative
overflow-hidden
text-white
pt-28
pb-14
bg-[url('/footer.jpg')]
bg-cover
bg-center
"
>

{/* Overlay */}
<div className="absolute inset-0 bg-black/75 z-0"/>


{/* Luxury top curve */}
<div className="absolute top-0 left-0 w-full z-10">
<svg
viewBox="0 0 1440 120"
preserveAspectRatio="none"
className="w-full h-[120px]"
>
<path
fill="#fff"
d="M0,80 C280,20 500,20 720,60 C940,100 1180,100 1440,60 L1440,0 L0,0 Z"
/>
</svg>
</div>


<div className="relative z-20 max-w-7xl mx-auto px-8 lg:px-12 pt-14">

<div className="grid md:grid-cols-[1.7fr_1fr_1fr] gap-4 mb-10">

{/* Brand Side */}
<motion.div
initial={{opacity:0,y:30}}
whileInView={{opacity:1,y:0}}
className="max-w-md"
>

<h2 className="mb-3 whitespace-nowrap text-[2.25rem] font-bold leading-[0.95] tracking-tight sm:text-[2.75rem] lg:text-[3.25rem]">
  Aan Attar
</h2>

<p className="text-zinc-300 text-xl leading-relaxed mb-8">
Premium attar and fragrance stories <br/>
crafted with olfactive artistry.
</p>



{/* Premium Social */}
<div className="flex gap-5 mb-8">

<a
href="#"
className="
w-14 h-14 rounded-full
border border-white/10
bg-white/5 backdrop-blur-xl
flex items-center justify-center
hover:bg-amber-400
hover:text-black
hover:scale-110
duration-500
"
>
<FaInstagram size={19}/>
</a>

<a
href="#"
className="
w-14 h-14 rounded-full
border border-white/10
bg-white/5 backdrop-blur-xl
flex items-center justify-center
hover:bg-amber-400
hover:text-black
hover:scale-110
duration-500
"
>
<FaFacebookF size={18}/>
</a>

<a
href="mailto:hello@theaanstory.com"
className="
w-14 h-14 rounded-full
border border-white/10
bg-white/5 backdrop-blur-xl
flex items-center justify-center
hover:bg-amber-400
hover:text-black
hover:scale-110
duration-500
"
>
<FaEnvelope size={18}/>
</a>

<a
href="tel:+9199999888888"
className="
w-14 h-14 rounded-full
border border-white/10
bg-white/5 backdrop-blur-xl
flex items-center justify-center
hover:bg-amber-400
hover:text-black
hover:scale-110
duration-500
"
>
<FaPhoneAlt size={18}/>
</a>

</div>


<div className="space-y-3 text-zinc-400">
<p>hello@theaanstory.com</p>
<p>+91 9876543210</p>
</div>

</motion.div>



{/* Right Links */}
{footerLinks.map((column,index)=>(

<motion.div
key={column.title}
initial={{opacity:0,y:30}}
whileInView={{opacity:1,y:0}}
transition={{delay:index*.1}}
className="pt-4"
>

<h4 className="
uppercase
tracking-[0.25em]
text-sm
mb-8
font-medium
text-amber-300
">
{column.title}
</h4>


<ul className="space-y-5">
{column.links.map((link)=>(

<li key={link.href}>
<Link
href={link.href}
className="
text-zinc-300
text-xl
font-light
hover:text-amber-300
duration-300
"
>
{link.label}
</Link>
</li>

))}
</ul>

</motion.div>

))}

</div>



{/* Bottom */}
<div className="
border-t border-white/10
pt-10
flex flex-col md:flex-row
justify-between items-center
gap-4
">

<p className="text-zinc-500 text-sm">
(c) {currentYear} Aan Attar. All rights reserved.
</p>

<p className="text-zinc-500 italic">
Crafted with luxury and precision
</p>

</div>

</div>

</motion.footer>
);
}
