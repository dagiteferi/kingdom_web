import React from 'react';

const InstagramLink = () => {
  return (
    <a
      href="https://www.instagram.com/hon772026?igsh=aTg3dzJ3cTRvd255"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
      aria-label="Instagram"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 17.25h-3.75v-3.75h3.75v3.75zm-1.875-5.625h-3.75V8.625h3.75v2.625zm-6.375 5.625H6v-9h3.75v9zm-1.875-11.25c-1.125 0-2.25.375-3 1.125-.75.75-1.125 1.875-1.125 3 0 1.125.375 2.25 1.125 3 1.125 1.125 2.875 1.125 3 1.125s1.875 0 3-1.125c.75-.75 1.125-1.875 1.125-3 0-1.125-.375-2.25-1.125-3-1.125-.75-2.875-1.125-3-1.125z"/>
      </svg>
    </a>
  );
};

export default InstagramLink;
