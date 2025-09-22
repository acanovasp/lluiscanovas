import React from 'react';

interface ContactInfoProps {
  className?: string;
}

export default function ContactInfo({ className }: ContactInfoProps) {
  return (
    <div className={className ? className : ''}>
      <p>
        <a href="mailto:info@lluiscanovas.com">info@lluiscanovas.com</a>
      </p>
      <p>
        <a href="tel:+34683665624">ES +34 683 665 624</a>
      </p>
    </div>
  );
}
