// src/components/Footer/Footer.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons'; // Note: If not installed, run `npm install @fortawesome/free-brands-svg-icons`
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col items-center md:flex-row md:justify-center gap-4">
          <a
              href="https://www.instagram.com/simon___spisak/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl flex items-center hover:text-gray-300"
          >
              <FontAwesomeIcon icon={faInstagram} className="mr-2" />
              @simon___spisak
          </a>
          <a
              href="tel:+421940957886"
              className="text-xl flex items-center hover:text-gray-300"
          >
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              +421917611836

          </a>
      </div>
    </footer>
  );
}