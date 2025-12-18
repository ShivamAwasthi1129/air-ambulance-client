"use client";
import { FaRoute, FaArrowRight, FaPlane } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PopularRoutesSection({ data }) {
  const routes =
    data && Array.isArray(data) && data[0]?.popularRoutes
      ? data[0].popularRoutes
      : [];

  if (routes.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-[#f7f9fc]">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaRoute className="text-xs" />
            Popular Routes
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Trending Flight Routes
          </h2>
        </motion.div>

        {/* Routes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          <div className="divide-y divide-gray-50">
            {routes.map((route, index) => (
              <motion.a
                key={route._id || index}
                href={route.url}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-4 hover:bg-[#f7f9fc] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#e8f4ff] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#008cff] transition-colors">
                    <FaPlane className="text-[#008cff] text-sm group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-[#008cff] transition-colors">
                      Private jet {route.name}
                    </p>
                    <p className="text-gray-500 text-xs">by Charter flights & helicopter</p>
                  </div>
                </div>
                <FaArrowRight className="text-gray-300 text-xs group-hover:text-[#008cff] group-hover:translate-x-1 transition-all" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
