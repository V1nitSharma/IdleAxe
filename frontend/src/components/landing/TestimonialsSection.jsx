import React from 'react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-[#0A0F24] border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { text: "IdleAxe reduced our staging waste by 32% in the first week.", author: "VP Engineering", company: "Fintech Scaleup" },
                        { text: "Finally a FinOps tool that actually takes action instead of just sending Jira tickets.", author: "Head of Cloud Ops", company: "Enterprise SaaS" },
                        { text: "The approval workflow gave our team the confidence to trust autonomous agents.", author: "Lead DevOps", company: "E-commerce Giant" },
                    ].map((quote, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0F172A] p-8 rounded-2xl border border-white/10"
                        >
                            <div className="text-yellow-500 mb-4 flex gap-1">
                                {[1,2,3,4,5].map(star => <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                            </div>
                            <p className="text-lg text-gray-300 mb-6 font-medium leading-relaxed">"{quote.text}"</p>
                            <div>
                                <div className="font-bold text-white">{quote.author}</div>
                                <div className="text-sm text-gray-500">{quote.company}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
