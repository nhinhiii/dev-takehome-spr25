"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const icons = [
  {
    Icon: Linkedin,
    link: "https://www.linkedin.com/in/nhi-y-ng/",
  },
  {
    Icon: Github,
    link: "https://github.com/nhinhiii",
  },
  {
    Icon: Mail,
    link: "mailto: nnguyen419@gatech.edu",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Kewl() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF5F2] p-4">
      <motion.div
        className="w-full max-w-3xl rounded-2xl bg-white p-8 text-gray-800 shadow-lg md:p-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="text-2xl font-bold text-gray-900 md:text-3xl"
          variants={itemVariants}
        >
          Hello everyone! I'm Nhi Nguyen
        </motion.p>

        <motion.ul
          className="mt-6 list-inside list-disc space-y-4 text-gray-700"
          variants={itemVariants}
        >
          <motion.li variants={itemVariants}>
            I'm a CS senior at Georgia with my threads are People &
            Intelligence.
          </motion.li>
          <motion.li variants={itemVariants}>
            Currently I'm an undergrad research assistant at SoWeLab under Dr.
            Munmun where my work is to help implement LLMs to understand their
            bias behavior in healthcare.
          </motion.li>
          <motion.li variants={itemVariants}>
            I'm also part of the PopSignAI team, building a gamified application
            for people to learn sign language, especially improving the
            connection between deaf children and hearing parents.
          </motion.li>
          <motion.li variants={itemVariants}>
            Fun Fact: I don't know whether I sing well or not, but I sing
            everytime haha!!
          </motion.li>
        </motion.ul>

        <motion.p
          className="mt-8 text-center text-md font-bold uppercase tracking-widest text-[#fe6937]"
          variants={itemVariants}
        >
          Get to know me
        </motion.p>

        <motion.p className="my-6 text-center text-sm">
          My Portfolio:{" "}
          <a
            href="https://nhinhiii.github.io/My-Portfolio/"
            className="text-blue-600 hover:underline"
          >
            {" "}
            https://nhinhiii.github.io/My-Portfolio/
          </a>
        </motion.p>

        <motion.div
          className=" flex items-center justify-center space-x-6"
          variants={itemVariants}
        >
          {icons.map((icon, key) => (
            <motion.a
              key={key}
              href={icon.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 p-3 text-gray-600 transition-all hover:bg-[#fe6937] hover:text-white hover:scale-110"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <icon.Icon className="h-6 w-6" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
