// src/components/Sections/Contact.tsx
import Image from 'next/image';
import products from "../../app/assets/products.jpg";

export default function Contact() {
  return (
    <section id="contact" className="bg-[#bda589] py-16 h-auto">
      <div className="container mx-auto h-[600px] px-4 sm:px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Kontakt</h2>

        <div className="flex flex-col md:flex-col md:h-[300px] items-center">
          <div className="md:h-auto w-full flex flex-col items-center">
            <div className="flex flex-col text-center md:text-left items-center pb-10">
              <p className="text-2xl font-serif mb-2">📍 𝓟𝓸𝓹𝓸𝓻𝓪𝓭</p>
              <p className="text-lg font-bold text-amber-100">Námestie svätého Egídia 36/59</p>
            </div>

            {/* Map wrapper: nie od okraja po okraj, max šírka + padding, pekný pomer strán */}
            <div className="w-full max-w-[720px] md:max-w-[900px]">
              <div className="overflow-hidden rounded-2xl shadow-lg border border-black/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2614.727073486906!2d20.295034615674!3d49.056959979306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4715f5f5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2sN%C3%A1mestie%20sv%C3%A4t%C3%A9ho%20Eg%C3%ADdia%2036%2F59%2C%20058%2001%20Poprad%2C%20Slovakia!5e0!3m2!1sen!2sus!4v1630000000000!5m2!1sen!2sus"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="block w-full h-[300px] sm:h-[360px] md:h-[420px]"
                  allowFullScreen={true}
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa - Námestie svätého Egídia 36/59"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}