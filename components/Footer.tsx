import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} OneSync B2B. Todos os direitos reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-600 transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
