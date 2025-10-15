import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, TrendingUp, Award } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  location: string;
  year: string;
  description: string;
  achievements: string[];
  impact: string;
  challenges?: string;
  image: string;
  beforeImage: string;
  afterImage: string;
}

interface TimelineItemProps {
  story: Story;
  isActive: boolean;
  onClick: () => void;
}

const TimelineItem = ({ story, isActive, onClick }: TimelineItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Create parallax effects only for non-active cards
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax for entire card
  const yCard = useTransform(scrollYProgress, [0, 1], [0, -10]);
  
  // More pronounced parallax for image
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -30]);
  
  // Fade effect at scroll boundaries
  const opacityCard = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.7, 1, 1, 0.7]);

  return (
    <div 
      ref={ref}
      className={`relative mb-20 last:mb-0 cursor-pointer transition-all duration-300 ${
        isActive ? 'scale-105 z-10' : 'hover:scale-102'
      }`}
      onClick={onClick}
    >
      <div className="absolute h-20 md:h-16 lg:h-auto left-0 top-0 bottom-0 w-px lg:bg-[linear-gradient(to_bottom,theme(colors.blue.200)_10%,transparent_20%)] dark:bg-[linear-gradient(to_bottom,theme(colors.blue.900/50)10%,transparent_20%)] ml-6 lg:ml-[11rem]"></div>
      
      <div className={`relative grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-8 ${
        isActive ? 'opacity-100' : 'opacity-70 hover:opacity-90'
      }`}>
        {/* Timeline marker and date */}
        <div className="flex lg:flex-col items-center lg:items-end lg:text-right">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
            isActive 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
              : 'bg-white dark:bg-gray-900 text-blue-600 border-2 border-blue-200 dark:border-blue-900/50'
          }`}>
            <Calendar className="h-5 w-5" />
          </div>
          <div className="ml-4 lg:ml-0 lg:mt-2">
            <p className="font-medium text-gray-600 dark:text-gray-400">
              {story.year}
            </p>
            <div className="flex items-center text-gray-500 dark:text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{story.location}</span>
            </div>
          </div>
        </div>
        
        {/* Content card with optimized parallax */}
        <motion.div 
          className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all ${
            isActive ? 'shadow-xl ring-2 ring-blue-600 ring-opacity-50' : ''
          }`}
          style={{
            y: isActive ? 0 : yCard, // Disable parallax when active
            opacity: isActive ? 1 : opacityCard
          }}
        >
          {/* Image with parallax effect */}
          <div className="h-48 overflow-hidden">
            <motion.img 
              src={story.image} 
              alt={story.title} 
              className="w-full h-full object-cover"
              style={{ 
                y: isActive ? 0 : yImage, // Disable parallax when active
                willChange: 'transform' // Optimize performance
              }}
            />
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              {story.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {story.description}
            </p>
            
            {isActive && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                transition={{ duration: 0.3 }}
              >
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-black dark:text-white flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-600" />
                      Key Achievements
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {story.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-600 before:rounded-full">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-black dark:text-white flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                      Impact
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {story.impact}
                    </p>
                  </div>
                  
                  {/* Before/After Comparison */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Before</p>
                      <img 
                        src={story.beforeImage} 
                        alt={`Before ${story.title}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">After</p>
                      <img 
                        src={story.afterImage} 
                        alt={`After ${story.title}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimelineItem;