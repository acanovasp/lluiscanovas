import React from 'react';

interface ContactInfoProps {
  className?: string;
}

export default function ContactInfo({ className }: ContactInfoProps) {
  return (
    <div className={className ? className : ''}>
      <p>info@lluiscanovas.com</p>
      <p>ES +34 682 665 624</p>
    </div>
  );
}
