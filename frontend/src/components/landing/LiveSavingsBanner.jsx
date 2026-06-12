import React from 'react';
import { motion } from 'framer-motion';

export default function LiveSavingsBanner() {
    return (
        <section className="border-y border-white/10 bg-[#0A0F24] py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-green-400 mb-2"
                        >
                            $3,420
                        </motion.div>
                        <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">Monthly Savings</div>
                    </div>
                    
                    <div className="text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-blue-400 mb-2"
                        >
                            142
                        </motion.div>
                        <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">Resources De-provisioned</div>
                    </div>

                    <div className="text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black text-white mb-2"
                        >
                            100%
                        </motion.div>
                        <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">Policy Compliant</div>
                    </div>

                    <div className="text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-black text-purple-400 mb-2"
                        >
                            28%
                        </motion.div>
                        <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">Infrastructure Savings</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
