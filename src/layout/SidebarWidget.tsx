import Image from 'next/image';
import React from 'react';

export default function SidebarWidget() {
  return (
    <div className="flex mt-4 items-center">
      <Image
        src="/images/demo-app.webp"
        alt="Newers World"
        height={50}
        width={50}
      />
      <span className="footer-text ms-1">TO THE NEW © 2025</span>
    </div>
  );
}
