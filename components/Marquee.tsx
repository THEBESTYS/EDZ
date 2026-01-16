
import React from 'react';

const Marquee: React.FC = () => {
  const items = [
    'Listening', 'Reading', 'Speaking', 'Writing', 'Grammar', 
    'Vocabulary', 'TOEIC', 'TOEFL', 'Business'
  ];

  return (
    <section className="bg-blue-950 py-5 border-y border-white/10 overflow-hidden relative z-30">
      <div className="w-full relative">
        <div className="marquee-content flex gap-16 items-center w-max opacity-50">
          {/* Double items for infinite effect */}
          {[...items, ...items].map((item, idx) => (
            <span key={idx} className="en-font text-lg font-bold uppercase tracking-wider text-white">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
