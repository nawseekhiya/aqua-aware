import { useState } from 'react';
import TimelineItem from '../components/ui/TimelineItem'; // Adjust the import path as needed

// Replace these with actual image imports
// const yapHead = './src/assets/yap-head.jpg';
// const yapBefore = './src/assets/yap-before.jpg';
// const yapAfter = './src/assets/yap-after.jpg';
// const sabarmatiHead = './src/assets/sabarmati-head.jpg';
// const sabarmatiBefore = './src/assets/sabarmati-before.jpg';
// const sabarmatiAfter = './src/assets/sabarmati-after.jpg';
// const noyyalHead = './src/assets/noyyal-head.jpg';
// const noyyalBefore = './src/assets/noyyal-before.jpg';
// const noyyalAfter = './src/assets/noyyal-after.jpg';
// const hussainSagarHead = './src/assets/hussainsagar-head.jpg';
// const hussainSagarBefore = './src/assets/hussainsagar-before.jpg';
// const hussainSagarAfter = './src/assets/hussainsagar-after.jpg';
// const cooumHead = './src/assets/cooum-head.jpg';
// const cooumBefore = './src/assets/cooum-before.jpg';
// const cooumAfter = './src/assets/cooum-after.jpg';

const successStories = [
  {
    id: 1,
    title: 'Yamuna Action Plan',
    location: 'Delhi, Uttar Pradesh',
    year: '1993 - Ongoing',
    description: 'The Yamuna Action Plan aims to improve the river\'s water quality by enhancing sewage treatment capacity and reducing industrial pollution.',
    achievements: [
      'Construction of 17 sewage treatment plants with 942.3 MLD capacity',
      'Development of electric crematoriums to reduce river pollution',
      'Implementation of industrial effluent standards and monitoring',
    ],
    impact: 'The BOD levels have decreased by 34% in selected stretches, with notable improvements in dissolved oxygen levels.',
    challenges: 'Continued population growth and urbanization present ongoing challenges.',
    // image: yapHead,
    // beforeImage: yapBefore,
    // afterImage: yapAfter,
  },
  {
    id: 2,
    title: 'Sabarmati Riverfront Development',
    location: 'Ahmedabad, Gujarat',
    year: '2005 - 2022',
    description: 'A comprehensive urban regeneration project that transformed a polluted, neglected river into a vibrant public space while improving water quality.',
    achievements: [
      'Construction of interceptor sewers to prevent sewage discharge',
      'Development of 11.5 km riverfront with public parks and amenities',
      'Implementation of strict industrial pollution controls',
    ],
    impact: 'Water quality improved from Class E to Class C. The riverfront now serves as a model for urban river restoration projects.',
    challenges: 'Maintaining water flow during dry seasons remains a challenge.',
    // image: sabarmatiHead,
    // beforeImage: sabarmatiBefore,
    // afterImage: sabarmatiAfter,
  },
  {
    id: 3,
    title: 'Noyyal River Restoration',
    location: 'Coimbatore, Tamil Nadu',
    year: '2011 - 2020',
    description: 'A community-led initiative to restore the Noyyal River, which had been severely polluted by textile dyeing and bleaching units.',
    achievements: [
      'Closure of polluting dyeing units following Supreme Court intervention',
      'Implementation of Zero Liquid Discharge technology in textile industry',
      'Restoration of 25 traditional water tanks in the river basin',
    ],
    impact: 'Significant reduction in TDS levels from 10,000 mg/L to below 2,100 mg/L. Groundwater quality in adjacent areas has improved.',
    challenges: 'Economic impacts on local textile industry required balancing with environmental goals.',
    // image: noyyalHead,
    // beforeImage: noyyalBefore,
    // afterImage: noyyalAfter,
  },
  {
    id: 4,
    title: 'Hussain Sagar Lake Cleanup',
    location: 'Hyderabad, Telangana',
    year: '2006 - 2018',
    description: 'A comprehensive lake restoration project for one of Hyderabad\'s iconic water bodies that had become severely polluted.',
    achievements: [
      'Diversion of sewage through interceptor sewers to STPs',
      'Dredging operations to remove contaminated sediment',
      'Installation of floating trash collectors and aeration systems',
    ],
    impact: 'BOD levels reduced from 28 mg/L to 8 mg/L. Dissolved oxygen levels increased from 0.8 mg/L to 4.2 mg/L.',
    challenges: 'Religious practices involving idol immersion require ongoing management solutions.',
    // image: hussainSagarHead,
    // beforeImage: hussainSagarBefore,
    // afterImage: hussainSagarAfter,
  },
  {
    id: 5,
    title: 'Cooum River Eco-Restoration',
    location: 'Chennai, Tamil Nadu',
    year: '2012 - Present',
    description: 'An ambitious project to restore the highly polluted Cooum River flowing through Chennai city.',
    achievements: [
      'Construction of 9 modular sewage treatment plants',
      'Removal of 10,600 tons of solid waste from the riverbed',
      'Resettlement of 14,257 families from encroached riverbanks',
    ],
    impact: 'Reduction in fecal coliform count from millions to thousands CFU/100ml in treated stretches. Return of several fish species.',
    challenges: 'Encroachments and continued sewage inflow from unsewered areas present ongoing challenges.',
    // image: cooumHead,
    // beforeImage: cooumBefore,
    // afterImage: cooumAfter,
  },
];

const SuccessPage = () => {
  const [activeStory, setActiveStory] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">
          <span className="gradient-text">Success Stories</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center mb-16">
          Celebrating the successful initiatives and projects that have made a significant impact in improving water quality across India.
        </p>

        <div className="max-w-4xl mx-auto">
          {successStories.map((story) => (
            <TimelineItem 
              key={story.id}
              story={story}
              isActive={activeStory === story.id}
              onClick={() => setActiveStory(activeStory === story.id ? null : story.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;