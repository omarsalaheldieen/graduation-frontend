import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-oranges text-cream px-6 py-16 md:px-20 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Logo + Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <img
            src="/logo.jpg"
            alt="Bazzzzar Logo"
            className="w-16 h-16 object-contain"
          />
          <h2 className="text-2xl font-bold text-primary font-marker tracking-wide">
            BAZZZZAR
          </h2>
          <p className="text-primary text-sm leading-relaxed">
            Curated fashion, lifestyle & tech. Delivered with style, simplicity,
            and speed.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h3 className="text-xl font-marker text-primary mb-5">Explore</h3>
          <ul className="space-y-3 text-lg font-medium text-primary">
            {["Shop", "Wishlist", "Cart", "My Account"].map((link, i) => (
              <li key={i}>
                <a
                  href={`/${link.toLowerCase().replace(" ", "")}`}
                  className="hover:text-peach transition-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
        >
          <h3 className="text-xl font-marker text-primary mb-5">
            Newsletter
          </h3>
          <p className="text-sm text-primary mb-4">
            Subscribe for trends & offers.
          </p>
          <form className="space-y-3">
            <div className="relative group">
              <input
                type="email"
                id="email"
                className="peer w-full px-4 pt-6 pb-2 bg-cream text-oranges rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary placeholder-transparent transition hover:scale-[1.01] duration-300 shadow-inner"
                placeholder="Email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-oranges text-sm transform transition-all duration-300 scale-100 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:scale-90 peer-focus:text-oranges"
              >
                Email Address
              </label>
            </div>
            <button
              type="submit"
              className="mt-2 w-full py-2 bg-primary text-cream font-bold rounded-lg hover:scale-105 duration-200 hover:text-oranges transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.div>

        {/* Social Connect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
        >
          <h3 className="text-xl font-marker text-primary mb-5">Connect</h3>
          <div className="flex flex-col space-y-4 text-primary text-base">
            {[
              { icon: FaFacebookF, name: "Facebook" },
              { icon: FaInstagram, name: "Instagram" },
              { icon: FaTwitter, name: "Twitter" },
              { icon: FaLinkedinIn, name: "LinkedIn" },
            ].map(({ icon: Icon, name }, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center space-x-3 hover:text-peach transition-all"
              >
                <Icon className="text-xl group-hover:animate-bounce" />
                <span>{name}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="mt-16 border-t border-primary pt-6 text-center text-sm text-primary">
        &copy; {new Date().getFullYear()} BAZZZZAR — Curated with . All rights
        reserved.
      </div>
    </footer>
  );
}
