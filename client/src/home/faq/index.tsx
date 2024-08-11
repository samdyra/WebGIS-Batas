import React from 'react';

// import { Typography, Accordion, AccordionHeader, AccordionBody } from '@material-tailwind/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const FAQS = [
  {
    title: 'When does the Back-to-School Campaign start and end?',
    desc: 'Our Back to School Campaign typically begins in late summer, around July or August, and continues through September. Be sure to check our website and promotional materials for specific dates each year.',
  },
  {
    title: 'What types of discounts and offers can I expect during the campaign?',
    desc: 'Our Back to School Campaign typically begins in late summer, around July or August, and continues through September. Be sure to check our website and promotional materials for specific dates each year.',
  },
  {
    title: 'Do you offer any discounts for educators and teachers?',
    desc: 'Our Back to School Campaign typically begins in late summer, around July or August, and continues through September. Be sure to check our website and promotional materials for specific dates each year.',
  },
  {
    title: 'Can I shop online during the campaign?',
    desc: 'Our Back to School Campaign typically begins in late summer, around July or August, and continues through September. Be sure to check our website and promotional materials for specific dates each year.',
  },
  {
    title: "What if I can't find a specific book or item I need for school?",
    desc: 'Our Back to School Campaign typically begins in late summer, around July or August, and continues through September. Be sure to check our website and promotional materials for specific dates each year.',
  },
];

export function Faq() {
  return (
    <section className="px-8 py-40">
      <div className="container mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold mb-5">Frequently Asked Questions</div>
          <div className="mx-auto mb-24 w-full max-w-2xl !text-gray-500">
            The Back-to-School Campaign is a special promotion designed to make your return to school as smooth as
            possible.
          </div>
        </div>
        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          <Accordion type="single" collapsible>
            {FAQS.map(({ title, desc }, key) => (
              <AccordionItem value={`item-${key}`} key={key}>
                <AccordionTrigger className="text-lg lg:text-xl">{title}</AccordionTrigger>
                <AccordionContent>{desc}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default Faq;
