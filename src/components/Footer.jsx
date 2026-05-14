import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../Styles/Footer.css'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Coluna 1: Sobre */}
        <div className="footer-section">
          <h3>Sobre TEAxis</h3>
          <p>
            TEAxis é uma plataforma inovadora que conecta indivíduos neurodiversos com profissionais especializados, oferecendo apoio, desenvolvimento e comunidade.
          </p>
          <div className="footer-social">
            <a href="#facebook" aria-label="Facebook" className="social-icon">
              <FaFacebook />
            </a>
            <a href="#instagram" aria-label="Instagram" className="social-icon">
              <FaInstagram />
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-icon">
              <FaLinkedin />
            </a>
            <a href="#twitter" aria-label="Twitter" className="social-icon">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul className="footer-links">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Sobre Nós</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#contato">Contato</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        {/* Coluna 3: Políticas */}
        <div className="footer-section">
          <h3>Políticas</h3>
          <ul className="footer-links">
            <li><a href="#privacidade">Política de Privacidade</a></li>
            <li><a href="#termos">Termos de Uso</a></li>
            <li><a href="#cookies">Política de Cookies</a></li>
            <li><a href="#seguranca">Segurança</a></li>
            <li><a href="#acessibilidade">Acessibilidade</a></li>
          </ul>
        </div>

        {/* Coluna 4: Contato */}
        <div className="footer-section">
          <h3>Entre em Contato</h3>
          <div className="footer-contact">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:contato@teaxis.com">contato@teaxis.com</a>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+5511999999999">+55 (11) 99999-9999</a>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>São Paulo, SP - Brasil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} TEAxis. Todos os direitos reservados.</p>
        <p className="footer-tagline">Conectando neurodiversidade com oportunidades.</p>
      </div>
    </footer>
  );
};

export default Footer;
