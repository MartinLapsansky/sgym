// src/app/page.tsx
import Home from "../components/Sections/Home";
import Services from "../components/Sections/Services";


export default function HomePage() {
    return (
        <div>
            <section id="domov"><Home /></section>
            {/*<section id="služby"><Services /></section>*/}
        </div>
    );
}