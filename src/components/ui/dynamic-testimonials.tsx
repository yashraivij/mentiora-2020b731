import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah M.",
    year: "Parent",
    content: "As a working mum, I was worried about Emily's Chemistry grades. This platform gave her the confidence she needed and I could see her progress daily. Best investment we've made!",
    subject: "Chemistry",
    improvement: "Grade 4 to 7"
  },
  {
    name: "David K.",
    year: "Parent", 
    content: "My son Jake went from dreading Maths to actually asking for extra practice time. The personalized approach really works - his teacher noticed the improvement immediately.",
    subject: "Mathematics", 
    improvement: "Grade 3 to 6"
  },
  {
    name: "Lisa H.",
    year: "Parent",
    content: "Sophie was so stressed about her GCSEs until we found this. The predicted grades helped us plan better and she felt prepared rather than panicked. She exceeded all expectations!",
    subject: "Biology",
    improvement: "Grade 5 to 9"
  },
  {
    name: "Mark T.",
    year: "Parent",
    content: "Watching Tom's confidence grow in Physics has been absolutely amazing. He went from barely understanding to helping his classmates. Worth every penny.",
    subject: "Physics",
    improvement: "Grade 4 to 8"
  },
  {
    name: "Rachel W.",
    year: "Parent",
    content: "As a teacher myself, I know good educational tools when I see them. My daughter Chloe's English Literature essays improved dramatically - even I was impressed by the feedback quality.",
    subject: "English Literature",
    improvement: "Grade 6 to 9"
  },
  {
    name: "James P.",
    year: "Parent",
    content: "Alex was struggling with Chemistry and losing motivation. This platform not only improved his grades but brought back his love for science. He's now considering A-levels in the subject!",
    subject: "Chemistry",
    improvement: "Grade 5 to 8"
  }
];

export const DynamicTestimonials = () => {
  // Duplicate testimonials for seamless loop
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden py-6">

      {/* Scrolling testimonials */}
      <div className="relative">
        <motion.div 
          className="flex gap-6"
          animate={{ 
            x: [0, -100 * testimonials.length] 
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 60,
              ease: "linear",
            },
          }}
          style={{ width: `${extendedTestimonials.length * 400}px` }}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              className="flex-shrink-0 w-64"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
                <Card className="relative h-full bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm tracking-tight">{testimonial.name}</h4>
                        <span className="text-xs font-medium px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                          {testimonial.year}
                        </span>
                      </div>
                      <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                        <Quote className="h-3 w-3 text-blue-600" />
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed text-xs font-medium">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                      <span className="text-xs font-medium text-gray-700">{testimonial.subject}</span>
                      <span className="text-blue-600 font-semibold text-xs">{testimonial.improvement}</span>
                    </div>
                    
                    <div className="flex justify-center mt-2 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Gradient overlays for smooth edges */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};