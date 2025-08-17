import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import MemberListing from '@/components/tables/MemberListing';
import { userListingService } from '@/services/memberService';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Member space | Login stack',
  description:
    'This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template',
  // other metadata
};

export default async function MemberSpacePage() {
  const dataInfo = await userListingService().catch((error) => {
    console.log(error, 'member listing page');
    return undefined;
  });
  return (
    <div>
      <PageBreadcrumb pageTitle="Member space" />
      <div className="space-y-6">
        <ComponentCard title="Member list">
          <MemberListing backInfo={dataInfo} />
        </ComponentCard>
      </div>
    </div>
  );
}
